// Three metrics are exported by executing one gql query.
export default {
    type: ['Gauge', 'Gauge', 'Gauge'],
    name: ['graph_epoch', 'graph_epoch_start_block', 'graph_epoch_end_block'],
    help: ['Graph epoch', 'Graph epoch start block', 'Graph epoch end block'],
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
        prometheus['graph_epoch'].set(Number(response.data.data.epoches[0].id));
        prometheus['graph_epoch_start_block'].set(Number(response.data.data.epoches[0].startBlock));
        prometheus['graph_epoch_end_block'].set(Number(response.data.data.epoches[0].endBlock));
    }
}
