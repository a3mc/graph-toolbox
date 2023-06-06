export default {
    type: ['Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge',
        'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge' ],
    name: [
        'mxN_node_count',
        'mxN_bls',
        'mxN_version',
        'mxN_rating',
        'mxN_temp_rating',
        'mxN_rating_modifier',
        'mxN_shard',
        'mxN_type',
        'mxN_status',
        'mxN_online',
        'mxN_nonce',
        'mxN_instances',
        'mxN_provider',
        'mxN_stake',
        'mxN_topUp',
        'mxN_locked',
        'mxN_leaderFailure',
        'mxN_validatorFailure',
        'mxN_validatorIgnoredSignatures',
        'mxN_validatorSuccess',
        'mxN_position'
    ],
    help: [
        'MX node count',
        'MX node bls',
        'MX node version',
        'MX node rating',
        'MX node temp rating',
        'MX node rating modifier',
        'MX node shard',
        'MX node type',
        'MX node status',
        'MX node online',
        'MX node nonce',
        'MX node instances',
        'MX node provider',
        'MX node stake',
        'MX node topUp',
        'MX node locked',
        'MX node leaderFailure',
        'MX node validatorFailure',
        'MX node validatorIgnoredSignatures',
        'MX node validatorSuccess',
        'MX node position'
    ],
    url: 'https://api.multiversx.com/nodes?provider=' + process.env.MX_PROVIDER,
    method: 'get',
    callback: (response, prometheus) => {
        const denom = 1000000000000000000;
        prometheus['mxN_node_count'].set(response.data.length);
        for (const node of response.data) {
            prometheus['mxN_bls'].labels(node.name, shortBls(node.bls)).set(1);
            prometheus['mxN_version'].labels(node.name, node.version).set(1);
            prometheus['mxN_rating'].labels(node.name, shortBls(node.bls)).set(node.rating ?? -1);
            prometheus['mxN_temp_rating'].labels(node.name, shortBls(node.bls)).set(node.tempRating ?? -1);
            prometheus['mxN_rating_modifier'].labels(node.name, shortBls(node.bls)).set(node.ratingModifier);
            prometheus['mxN_shard'].labels(node.name, shortBls(node.bls)).set(node.shard ?? -1);
            prometheus['mxN_type'].labels(node.name, node.type).set(1);
            prometheus['mxN_status'].labels(node.name, node.status).set(1);
            prometheus['mxN_online'].labels(node.name, node.bls).set(node.online ? 1 : 0);
            prometheus['mxN_nonce'].labels(node.name, shortBls(node.bls)).set(node.nonce ?? -1);
            prometheus['mxN_instances'].labels(node.name, shortBls(node.bls)).set(node.instances ?? -1);
            prometheus['mxN_provider'].labels(shortBls(node.bls), node.provider).set(1);
            prometheus['mxN_stake'].labels(node.name, shortBls(node.bls)).set(Number(node.stake ?? -1) / denom);
            prometheus['mxN_topUp'].labels(node.name, shortBls(node.bls)).set(Number(node.topUp ?? -1) / denom);
            prometheus['mxN_locked'].labels(node.name, shortBls(node.bls)).set(Number(node.locked ?? -1) / denom);
            prometheus['mxN_leaderFailure'].labels(node.name, shortBls(node.bls)).set(node.leaderFailure ?? -1);
            prometheus['mxN_validatorFailure'].labels(node.name, shortBls(node.bls)).set(node.validatorFailure ?? -1);
            prometheus['mxN_validatorIgnoredSignatures'].labels(node.name, shortBls(node.bls)).set(node.validatorIgnoredSignatures ?? -1);
            prometheus['mxN_validatorSuccess'].labels(node.name, shortBls(node.bls)).set(node.validatorSuccess ?? -1);
            prometheus['mxN_position'].labels(node.name, shortBls(node.bls)).set(node.position ?? -1);
        }

        function shortBls( bls ) {
            return bls.substring(0, 6) + '...' + bls.substring(bls.length - 6);
        }

    }
}
