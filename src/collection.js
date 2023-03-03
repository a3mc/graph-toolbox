import * as dotenv from 'dotenv';

dotenv.config();
let lastBlock = 0;
export default [
    {
        type: 'Gauge',
        name: 'graph_block',
        help: 'Graph block number',
        url: process.env.NETWORK_SUBGRAPH,
        query: `query {
            _meta {
                block { number }
            }
        }`,
        callback: (response, prometheus) => {
            lastBlock = response.data.data._meta.block.number
            prometheus.set(lastBlock);
        }
    },
    {
        type: 'Gauge',
        name: 'graph_epoch',
        help: 'Graph epoch',
        url: process.env.NETWORK_SUBGRAPH,
        query: `query NetworkData {
                  graphNetwork: graphNetwork(id: 1, subgraphError: "deny") {
                    epochLength
                  }
                  epoches: epoches(
                    orderBy: "startBlock"
                    orderDirection: "desc"
                    first: 1
                    skip: 0
                    subgraphError: "deny"
                  ) {
                      id
                      startBlock
                      endBlock
                  }
                }`,
        callback: (response, prometheus) => {
            prometheus.set(Number(response.data.data.epoches[0].id));
        }
    },
    {
        type: ['Gauge', 'Gauge'],
        name: ['oracle_block', 'oracle_epoch'],
        help: ['Block oracle block', 'Block oracle epoch'],
        url: process.env.BLOCK_ORACLE,
        query: `query MyQuery {
                  _meta { block { number } }
                  epoches(first: 1, orderBy: epochNumber, orderDirection: desc) { id }
                }`,
        callback: (response, prometheus) => {
            prometheus[0].set(Number(response.data.data._meta.block.number));
            prometheus[1].set(Number(response.data.data.epoches[0].id));
        }
    },
    {
        type: ['Gauge', 'Gauge'],
        name: ['juan_oracle_block', 'juan_oracle_epoch'],
        help: ['Juan oracle block', 'Juan oracle epoch'],
        url: process.env.JUAN_BLOCK_ORACLE,
        query: `query MyQuery {
                  _meta { block { number } }
                  epoches(first: 1, orderBy: epochNumber, orderDirection: desc) { id }
                }`,
        callback: (response, prometheus) => {
            prometheus[0].set(Number(response.data.data._meta.block.number));
            prometheus[1].set(Number(response.data.data.epoches[0].id));
        }
    },
    {
        type: ['Gauge', 'Gauge', 'Gauge'],
        name: ['graph_active_subs', 'graph_deprecated_subs', 'graph_alloc_ages'],
        help: ['Active subgraphs count', 'Deprecated subgraphs count', 'Allocations block age'],
        url: process.env.NETWORK_SUBGRAPH,
        query: `fragment IndexerAllocationFragment on Allocation {
                  id
                  status
                  createdAtBlockNumber
                  subgraphDeployment {
                    ipfsHash
                    versions(first: 1000, where: {entityVersion: 2}) {
                      id
                      subgraph(where: {status: Active}) {
                        id
                        active
                        displayName
                        currentVersion { id subgraphDeployment { id } }
                      }
                    }
                  }
                }
                {
                  allocations(
                    first: 1000
                    skip: 0
                    orderBy: createdAt
                    orderDirection: desc
                    where: {indexer: "${process.env.INDEXER_ADDRESS}", status: Active}
                  ) { ...IndexerAllocationFragment }
                }`,
        callback: (response, prometheus) => {
            prometheus[0].set(Number(response.data.data.allocations.length));

            prometheus[1].set(response.data.data.allocations.filter(
                allocation => {
                    return allocation.subgraphDeployment.versions[0].id !==
                        allocation.subgraphDeployment.versions[0].subgraph.currentVersion.id;
                }).length);

            if (lastBlock) {
                for (const allocation of response.data.data.allocations) {
                    const subgraphName = allocation.subgraphDeployment.versions[0].subgraph.displayName;
                    const allocationId = allocation.subgraphDeployment.ipfsHash;
                    const ageInBlocks = lastBlock - Number(allocation.createdAtBlockNumber);
                    prometheus[2].labels(allocationId, subgraphName).set(ageInBlocks);
                }
            }
        }
    },
    {
        type: ['Gauge', 'Gauge', 'Gauge'],
        name: ['sgt_graph_active_subs', 'sgt_graph_deprecated_subs', 'sgt_graph_alloc_ages'],
        help: ['SGTstake Active subgraphs count', 'SGTstake Deprecated subgraphs count', 'SGTstake Allocations block age'],
        url: process.env.NETWORK_SUBGRAPH,
        query: `fragment IndexerAllocationFragment on Allocation {
                  id
                  status
                  createdAtBlockNumber
                  subgraphDeployment {
                    ipfsHash
                    versions(first: 1000, where: {entityVersion: 2}) {
                      id
                      subgraph(where: {status: Active}) {
                        id
                        active
                        displayName
                        currentVersion { id subgraphDeployment { id } }
                      }
                    }
                  }
                }
                {
                  allocations(
                    first: 1000
                    skip: 0
                    orderBy: createdAt
                    orderDirection: desc
                    where: {indexer: "${process.env.INDEXER_ADDRESS2}", status: Active}
                  ) { ...IndexerAllocationFragment }
                }`,
        callback: (response, prometheus) => {
            prometheus[0].set(Number(response.data.data.allocations.length));

            prometheus[1].set(response.data.data.allocations.filter(
                allocation => {
                    return allocation.subgraphDeployment.versions[0].id !==
                        allocation.subgraphDeployment.versions[0].subgraph.currentVersion.id;
                }).length);

            if (lastBlock) {
                for (const allocation of response.data.data.allocations) {
                    const subgraphName = allocation.subgraphDeployment.versions[0].subgraph.displayName;
                    const allocationId = allocation.subgraphDeployment.ipfsHash;
                    const ageInBlocks = lastBlock - Number(allocation.createdAtBlockNumber);
                    prometheus[2].labels(allocationId, subgraphName).set(ageInBlocks);
                }
            }
        }
    },
    {
        type: 'Counter',
        name: 'indexer_url_downtime_counter',
        help: 'Downtime counter of indexer URL',
        url: process.env.INDEXER_URL,
        method: 'get',
        callback: (response, prometheus) => {
            if ( response.status !== 200 ) prometheus.inc();
        }
    },
];
