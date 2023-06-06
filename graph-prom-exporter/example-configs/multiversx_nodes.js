export default {
    type: ['Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge',
        'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge'],
    name: [
        'mxN_node_count', 'mxN_bls', 'mxN_name', 'mxN_version', 'mxN_rating', 'mxN_temp_rating', 'mxN_rating_modifier',
        'mxN_shard', 'mxN_type', 'mxN_status', 'mxN_online', 'mxN_nonce', 'mxN_instances', 'mxN_identity',
        'mxN_provider', 'mxN_stake', 'mxN_topUp', 'mxN_locked', 'mxN_leaderFailure', 'mxN_validatorFailure',
        'mxN_validatorIgnoredSignatures', 'mxN_validatorSuccess', 'mxN_position'
    ],
    help: ['MX Nodes count', 'MX Node bls', 'MX Node name', 'MX Node version', 'MX Node rating', 'MX Node tempRating', 'MX Node ratingModifier',
        'MX Node shard', 'MX Node type', 'MX Node status', 'MX Node online', 'MX Node nonce', 'MX Node instances', 'MX Node identity',
        'MX Node provider', 'MX Node stake', 'MX Node topUp', 'MX Node locked', 'MX Node leaderFailure', 'MX Node validatorFailure',
        'MX Node validatorIgnoredSignatures', 'MX Node validatorSuccess', 'MX Node position'
    ],
    url: 'https://api.multiversx.com/nodes?provider=' + process.env.MX_PROVIDER,
    method: 'get',
    callback: (response, prometheus) => {
        const denom = 1000000000000000000;
        prometheus['mxN_node_count'].set(response.data.length);
        for (const node of response.data) {
            prometheus['mxN_bls'].labels(node.identity, node.bls).set(1);
            prometheus['mxN_name'].labels(node.identity, node.name).set(1);
            prometheus['mxN_version'].labels(node.identity, node.version).set(1);
            prometheus['mxN_rating'].labels(node.identity, node.name).set(node.rating ?? -1);
            prometheus['mxN_temp_rating'].labels(node.identity, node.name).set(node.tempRating ?? -1);
            prometheus['mxN_rating_modifier'].labels(node.identity, node.name).set(node.ratingModifier);
            prometheus['mxN_shard'].labels(node.identity, node.name).set(node.shard ?? -1);
            prometheus['mxN_type'].labels(node.identity, node.type).set(1);
            prometheus['mxN_status'].labels(node.identity, node.status).set(1);
            prometheus['mxN_online'].labels(node.identity, node.name).set(node.online ? 1 : 0);
            prometheus['mxN_nonce'].labels(node.identity, node.name).set(node.nonce ?? -1);
            prometheus['mxN_instances'].labels(node.identity, node.name).set(node.instances ?? -1);
            prometheus['mxN_identity'].labels(node.identity, node.name).set(1);
            prometheus['mxN_provider'].labels(node.identity, node.provider).set(1);
            prometheus['mxN_stake'].labels(node.identity, node.name).set(Number(node.stake ?? -1) / denom);
            prometheus['mxN_topUp'].labels(node.identity, node.name).set(Number(node.topUp ?? -1) / denom);
            prometheus['mxN_locked'].labels(node.identity, node.name).set(Number(node.locked ?? -1) / denom);
            prometheus['mxN_leaderFailure'].labels(node.identity, node.name).set(node.leaderFailure ?? -1);
            prometheus['mxN_validatorFailure'].labels(node.identity, node.name).set(node.validatorFailure ?? -1);
            prometheus['mxN_validatorIgnoredSignatures'].labels(node.identity, node.name).set(node.validatorIgnoredSignatures ?? -1);
            prometheus['mxN_validatorSuccess'].labels(node.identity, node.name).set(node.validatorSuccess ?? -1);
            prometheus['mxN_position'].labels(node.identity, node.name).set(node.position ?? -1);
        }


    }
}
