import { get, param, response } from '@loopback/rest';
import { inject } from '@loopback/core';
import * as dotenv from 'dotenv';
import { AGENT_POOL_CONNECTION, NODE_POOL_CONNECTION } from '../pool.providers';
import { Pool } from 'pg';
import { statusMock } from "../mocks/status.mock";
import { queueMock } from "../mocks/queue.mock";

dotenv.config();

export class ActionsQueueController {
    constructor(
        @inject( AGENT_POOL_CONNECTION ) private agentPool: Pool,
        @inject( NODE_POOL_CONNECTION ) private nodePool: Pool,
    ) {
    }

    @get( 'actions-queue' )
    @response( 200 )
    async queue(
        @param.query.number( 'limit' ) limit: number = 50,
    ): Promise<any> {
        if ( process.env.USE_MOCKS ) {
            return queueMock.slice(0, limit);
        }

        const client = await this.agentPool.connect();
        const queue = await client.query(
            "SELECT t.* FROM public.\"Actions\" t ORDER BY id DESC LIMIT " + limit
        );
        client.release();
        return queue.rows;
    }

    @get( 'status' )
    @response( 200 )
    async status(): Promise<any> {
        if ( process.env.USE_MOCKS ) {
            return statusMock;
        }

        const client = await this.agentPool.connect();
        await client.query( 'BEGIN' );

        const queue = await client.query(
            "SELECT t.* FROM public.\"IndexingRules\" t ORDER BY id DESC"
        );
        const collectedFees = await client.query(
            "SELECT SUM(t.\"collectedFees\") AS \"collectedFees\" FROM public.\"allocation_summaries\" t"
        );
        const withdrawnFees = await client.query(
            "SELECT SUM(t.\"withdrawnFees\") AS \"withdrawnFees\" FROM public.\"allocation_summaries\" t"
        );
        const costModels = await client.query(
            "SELECT t.* FROM public.\"CostModels\" t"
        );

        await client.query( 'COMMIT' );
        client.release();

        const nodeClient = await this.nodePool.connect();
        await nodeClient.query( 'BEGIN' );

        const deployments = await nodeClient.query(
            "SELECT t.* FROM subgraphs.\"subgraph_deployment\" t ORDER BY id DESC LIMIT 100"
        );

        const networks = await nodeClient.query(
            "SELECT t.* FROM public.\"ethereum_networks\" t"
        );

        await nodeClient.query( 'COMMIT' );
        nodeClient.release();

        return {
            rules: queue.rows,
            collectedFees: collectedFees.rows.length ? collectedFees.rows[0].collectedFees : 0,
            withdrawnFees: withdrawnFees.rows.length ? withdrawnFees.rows[0].withdrawnFees : 0,
            costModels: costModels.rows,
            deployments: deployments.rows,
            networks: networks.rows,
        };
    }
}
