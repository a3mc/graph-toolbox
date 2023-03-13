import * as dotenv from 'dotenv';
import Prometheus from 'prom-client';
import express from 'express';
import bodyParser from 'body-parser';
import logger from './logger.js';

dotenv.config();
export class Metrics {

    server;
    app = express();
    port = Number(process.env.METRICS_PORT || 9090);
    metrics = {
        primaryHealth: new Prometheus.Gauge({
            name: 'primary_health',
            help: 'Primary node health',
        }),
        failoverHealth: new Prometheus.Gauge({
            name: 'failover_health',
            help: 'Failover node health',
        }),
        primaryLastBlock: new Prometheus.Gauge({
            name: 'primary_last_block',
            help: 'Primary block height',
        }),
        failoverLastBlock: new Prometheus.Gauge({
            name: 'failover_last_block',
            help: 'Failover block height',
        }),
        currentRpc: new Prometheus.Gauge({
            name: 'current_rpc',
            help: 'Current Rpc Node 0 - Primary, 1 - Failover',
        }),
        successfulRpcRequests: new Prometheus.Counter({
            name: 'successful_rpc_requests',
            help: 'Successful RPC Requests',
        }),
        failedRpcRequests: new Prometheus.Counter({
            name: 'failed_rpc_requests',
            help: 'Failed RPC Requests',
        }),
        totalProxyRequests: new Prometheus.Counter({
            name: 'total_requests',
            help: 'Requests to proxy',
        }),
    }
    constructor() {
        Prometheus.collectDefaultMetrics();
        this.app.use(bodyParser.json());
        this.app.get('/metrics', async (req, res) => {
            try {
                const promMetrics = await Prometheus.register.metrics();
                res.set('Content-Type', Prometheus.register.contentType);
                res.end(promMetrics);
            } catch (error) {
                logger.error(error.message);
                res.status(500).end();
            }
        });
        this.server = this.app.listen(this.port, () => {
            logger.info('Metrics server listening on port ' + this.port);
        });
    }
}
