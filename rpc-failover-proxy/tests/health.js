import { expect } from 'chai';
import { Health } from '../app/health-check.js';

describe('Health', () => {
    const metrics = {
        metrics: {
            primaryHealth: {
                set: () => {}
            },
            failoverHealth: {
                set: () => {}
            },
            primaryLastBlock: {
                set: () => {}
            },
            failoverLastBlock: {
                set: () => {}
            },
            currentRpc: {
                set: () => {}
            }
        }
    };

    it('should initialize health object correctly', () => {
        const health = new Health(metrics);

        expect(health.health.primary.lastBlock).to.equal(0);
        expect(health.health.primary.healthy).to.be.false;
        expect(health.health.failover.lastBlock).to.equal(0);
        expect(health.health.failover.healthy).to.be.false;
    });

    it('should set primary node URL from environment variable', () => {
        process.env.PRIMARY_NODE_URL = 'http://localhost:8545';

        const health = new Health(metrics);

        expect(health.primaryNodeUrl).to.equal(process.env.PRIMARY_NODE_URL);
    });

    it('should set failover node URL from environment variable', () => {
        process.env.FAILOVER_NODE_URL = 'http://localhost:8546';

        const health = new Health(metrics);

        expect(health.failoverNodeUrl).to.equal(process.env.FAILOVER_NODE_URL);
    });

    it('should check node health correctly', async () => {
        const health = new Health(metrics);

        await health.checkNode('http://localhost:8545', 'primary');

        expect(health.health.primary.lastBlock).to.be.a('number');
        expect(health.health.primary.healthy).to.be.a('boolean');
    });

    it('should report unhealthy node correctly', () => {
        const health = new Health(metrics);

        health.reportNode('http://localhost:8545');

        expect(health.health.primary.healthy).to.be.false;
    });

    it('should get healthy node correctly', () => {
        const health = new Health(metrics);
        health.health.primary.healthy = true;

        const nodeUrl = health.getHealthyNode();

        expect(nodeUrl).to.equal(process.env.PRIMARY_NODE_URL);
    });
});
