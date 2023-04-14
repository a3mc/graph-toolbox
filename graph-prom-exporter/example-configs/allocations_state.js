// This is a more complex example that uses filtering in the callback function and uses a global.state variable.
export default {
    type: ['Gauge', 'Gauge', 'Gauge'],
    name: ['active_subs', 'deprecated_subs', 'alloc_ages'],
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
        // Active subgraphs count
        prometheus['active_subs'].set(Number(response.data.data.allocations.length));

        // Filter out allocations that are not the current version of the subgraph.
        prometheus['deprecated_subs'].set(response.data.data.allocations.filter(
            allocation => {
                return allocation.subgraphDeployment.versions[allocation.subgraphDeployment.versions.length-1].id !==
                    allocation.subgraphDeployment.versions[allocation.subgraphDeployment.versions.length-1].subgraph.currentVersion.id;
            }).length);

        // This may not trigger for the first call, but it will trigger for all subsequent calls,
        // when the global state is updated.
        if (global.state.lastBlock) {
            for (const allocation of response.data.data.allocations) {
                const subgraphName = allocation.subgraphDeployment.versions[0].subgraph.displayName;
                const allocationId = allocation.subgraphDeployment.ipfsHash;
                const ageInBlocks = global.state.lastBlock - Number(allocation.createdAtBlockNumber);
                prometheus['alloc_ages'].labels(allocationId, subgraphName).set(ageInBlocks);
            }
        }
    }
}
