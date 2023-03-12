// A basic example with one Gauge, that creates a gauge and sets it to the current block number.
// A global state stores the last block, so it can be used in other metrics.
export default {
    type: ['Gauge'],
    name: ['graph_block'],
    help: ['Graph block number'],
    url: process.env.NETWORK_SUBGRAPH,
    query: `query {
                _meta {
                    block { number }
                }
            }`,
    callback: (response, prometheus) => {
        const lastBlock = response.data.data._meta.block.number
        prometheus['graph_block'].set(lastBlock);
        global.state.lastBlock = lastBlock;
    }
}
