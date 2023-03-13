import { BindingKey, Provider } from "@loopback/core";
import { Pool } from "pg";
import * as dotenv from 'dotenv';

dotenv.config();

export const AGENT_POOL_CONNECTION = BindingKey.create<Pool>('postgresql.agentpool');
export const NODE_POOL_CONNECTION = BindingKey.create<Pool>("postgresql.nodepool");

export class PgAgentPoolProvider implements Provider<Pool> {
    constructor() {}

    value(): Pool {
        return new Pool({
            user: process.env.INDEXER_AGENT_POSTGRES_USERNAME,
            host: process.env.INDEXER_AGENT_POSTGRES_HOST,
            database: process.env.INDEXER_AGENT_POSTGRES_DATABASE,
            password: process.env.INDEXER_AGENT_POSTGRES_PASSWORD,
            // @ts-ignore
            port: parseInt( process.env.INDEXER_AGENT_POSTGRES_PORT ),
        });
    }
}

export class PgNodePoolProvider implements Provider<Pool> {
    constructor() {}

    value(): Pool {
        return new Pool({
            user: process.env.GRAPH_NODE_POSTGRES_USERNAME,
            host: process.env.GRAPH_NODE_POSTGRES_HOST,
            database: process.env.GRAPH_NODE_POSTGRES_DATABASE,
            password: process.env.GRAPH_NODE_POSTGRES_PASSWORD,
            // @ts-ignore
            port: parseInt( process.env.GRAPH_NODE_POSTGRES_PORT ),
        });
    }
}
