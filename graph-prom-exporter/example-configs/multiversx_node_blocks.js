export default {
    type: ['Gauge'],
    name: [
        'mx_nodes_blocks',
    ],
    help: [
        'MX nodes blocks',
    ],
    url: process.env.BLS?.split(',').map(bls => 'https://api.multiversx.com/blocks/count?proposer=' + bls),
    method: 'get',
    callback: (response, prometheus) => {
        prometheus['mx_nodes_blocks'].labels(shortBlsFromUrl(response.config.url), 'blocks').set(Number(response.data) || 0)
    }
}

function shortBlsFromUrl(url) {
    const bls = url.split('=').pop();
    return bls.substring(0, 6) + '...' + bls.substring(bls.length - 6);
}
