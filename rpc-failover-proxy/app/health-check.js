import axios from 'axios';
import logger from './logger.js';
import * as dotenv from 'dotenv';

dotenv.config();

export class Health {
    primaryNodeUrl = process.env.PRIMARY_NODE_URL;
    failoverNodeUrl = process.env.FAILOVER_NODE_URL;
    cancelToken = null;
    isShuttingDown = false;
    health = {
        primary: {
            lastBlock: 0,
            healthy: false,
        },
        failover: {
            lastBlock: 0,
            healthy: false,
        }
    }

    constructor(metrics) {
        this._metrics = metrics;
        this.check();
    }

    async check() {
        try {
            await this.checkNode(this.primaryNodeUrl, 'primary');
            await this.checkNode(this.failoverNodeUrl, 'failover');
        } catch (error) {
            logger.error('Health check routine failed with %s', error.message);
        }

        this._metrics.metrics.primaryHealth.set(this.health.primary.healthy ? 1 : 0);
        this._metrics.metrics.failoverHealth.set(this.health.failover.healthy ? 1 : 0);
        this._metrics.metrics.primaryLastBlock.set(this.health.primary.lastBlock);
        this._metrics.metrics.failoverLastBlock.set(this.health.failover.lastBlock);
        this.getHealthyNode();
        setTimeout(async () => {
            await this.check();
        }, Number(process.env.HEALTHCHECK_INTERVAL || 15000));
    }

    async checkNode(nodeUrl, nodeName) {
        if (this.isShuttingDown) return;
        // logger.debug('Checking health of %s node', nodeName);

        const node = this.health[nodeName];
        try {
            this.cancelToken = axios.CancelToken;
            const {cancel} = this.cancelToken.source();
            const axiosTimeout = setTimeout(() => {
                cancel('Timeout reached');
            }, Number(process.env.TIMEOUT));

            const response = await axios.post(
                nodeUrl,
                JSON.stringify({"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}),
                {
                    headers: {'Content-Type': 'application/json'},
                    timeout: Number(process.env.TIMEOUT || 5000),
                    cancelToken: this.cancelToken.token,
                }
            ).catch((error) => {
                clearTimeout(axiosTimeout);
                throw error;
            });

            clearTimeout(axiosTimeout);

            const blockNumber = Number(response.data.result);
            const maxLastBlock = Math.max(this.health.primary.lastBlock, this.health.failover.lastBlock)

            if (blockNumber > this.health[nodeName].lastBlock || maxLastBlock === 0) {
                node.lastBlock = blockNumber;
                if (blockNumber >= maxLastBlock || (maxLastBlock === 0 && blockNumber > 0)) {
                    node.healthy = true;
                } else {
                    logger.warn('Block is less than maxLastBlock on %s node: %d', nodeName, blockNumber);
                    node.healthy = false;
                }
            } else {
                logger.warn('Block is not increasing on %s node: %d', nodeName, blockNumber);
                node.healthy = false;
            }

        } catch (error) {
            logger.warn('Error checking health of %s node', nodeName);
            logger.warn(error.message);
            node.healthy = false;
        }
    }

    reportNode(node) {
        if (node === this.primaryNodeUrl) {
            this._metrics.metrics.primaryHealth.set(0);
            this.health.primary.healthy = false;
        } else if (node === this.failoverNodeUrl) {
            this._metrics.metrics.failoverHealth.set(0);
            this.health.failover.healthy = false;
        }
    }

    getHealthyNode() {
        if (this.health.primary.healthy) {
            this._metrics.metrics.currentRpc.set(0);
            return this.primaryNodeUrl;
        }

        if (this.health.failover.healthy) {
            this._metrics.metrics.currentRpc.set(1);
            return this.failoverNodeUrl;
        }

        return null;
    }
}
