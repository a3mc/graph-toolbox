// Check another endpoint that can be defined directly here or in ENV variables.
export default {
    type: ['Gauge', 'Gauge'],
    name: ['oracle_block', 'oracle_epoch'],
    help: ['Block oracle block', 'Block oracle epoch'],
    url: process.env.BLOCK_ORACLE,
    query: `query MyQuery {
                  _meta { block { number } }
                  epoches(first: 1, orderBy: epochNumber, orderDirection: desc) { id }
                }`,
    callback: (response, prometheus) => {
        prometheus['oracle_block'].set(Number(response.data.data._meta.block.number));
        prometheus['oracle_epoch'].set(Number(response.data.data.epoches[0].id));
    }
}
