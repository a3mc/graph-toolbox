export default {
    type: ['Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge',
        'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge' ],
    name: [
        'mxn_node_cnt',
        'mxn_bls',
        'mxn_version',
        'mxn_rating',
        'mxn_temp_rating',
        'mxn_rating_modifier',
        'mxn_shard',
        'mxn_type',
        'mxn_status',
        'mxn_status_n',
        'mxn_online',
        'mxn_nonce',
        'mxn_instances',
        'mxn_provider',
        'mxn_stake',
        'mxn_top_up',
        'mxn_locked',
        'mxn_leader_failure',
        'mxn_validator_failure',
        'mxn_validator_ignored_signatures',
        'mxn_validator_success',
        'mxn_position'
    ],
    help: [
        'MX node cnt',
        'MX node bls',
        'MX node version',
        'MX node rating',
        'MX node temp rating',
        'MX node rating modifier',
        'MX node shard',
        'MX node type',
        'MX node status',
        'MX node status number',
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
        'MX node position',
    ],
    url: 'https://api.multiversx.com/nodes?provider=' + process.env.MX_PROVIDER,
    method: 'get',
    callback: (response, prometheus) => {
        const denom = 1000000000000000000;
        const statuses = {
            'eligible': 0,
            'waiting': 1,
            'queued': 2,
            // other : 3
        }
        prometheus['mxn_node_cnt'].set(response.data.length);
        for (const node of response.data) {
            node.name && prometheus['mxn_bls'].labels(node.name, shortBls(node.bls)).set(1);
            node.name && prometheus['mxn_version'].labels(node.name, node.version).set(1);
            node.name && prometheus['mxn_rating'].labels(node.name, shortBls(node.bls)).set(node.rating ?? -1);
            node.name && prometheus['mxn_temp_rating'].labels(node.name, shortBls(node.bls)).set(node.tempRating ?? -1);
            node.name && prometheus['mxn_rating_modifier'].labels(node.name, shortBls(node.bls)).set(node.ratingModifier);
            node.name && prometheus['mxn_shard'].labels(node.name, shortBls(node.bls)).set(node.shard ?? -1);
            node.name && prometheus['mxn_type'].labels(node.name, node.type).set(1);
            node.name && prometheus['mxn_status'].labels(node.name, node.status).set(1);
            node.name && prometheus['mxn_status_n'].labels(node.name, shortBls(node.bls)).set( statuses[node.status] ?? 3);
            node.name && prometheus['mxn_online'].labels(node.name, shortBls(node.bls)).set(node.online ? 1 : 0);
            node.name && prometheus['mxn_nonce'].labels(node.name, shortBls(node.bls)).set(node.nonce ?? -1);
            node.name && prometheus['mxn_instances'].labels(node.name, shortBls(node.bls)).set(node.instances ?? -1);
            node.name && prometheus['mxn_provider'].labels(shortBls(node.bls), node.provider).set(1);
            node.name && prometheus['mxn_stake'].labels(node.name, shortBls(node.bls)).set(Number(node.stake ?? -1) / denom);
            node.name && prometheus['mxn_top_up'].labels(node.name, shortBls(node.bls)).set(Number(node.topUp ?? -1) / denom);
            node.name && prometheus['mxn_locked'].labels(node.name, shortBls(node.bls)).set(Number(node.locked ?? -1) / denom);
            node.name && prometheus['mxn_leader_failure'].labels(node.name, shortBls(node.bls)).set(node.leaderFailure ?? -1);
            node.name && prometheus['mxn_validator_failure'].labels(node.name, shortBls(node.bls)).set(node.validatorFailure ?? -1);
            node.name && prometheus['mxn_validator_ignored_signatures'].labels(node.name, shortBls(node.bls)).set(node.validatorIgnoredSignatures ?? -1);
            node.name && prometheus['mxn_validator_success'].labels(node.name, shortBls(node.bls)).set(node.validatorSuccess ?? -1);
            node.name && prometheus['mxn_position'].labels(node.name, shortBls(node.bls)).set(node.position ?? -1);
        }

        function shortBls( bls ) {
            return bls.substring(0, 6) + '...' + bls.substring(bls.length - 6);
        }

    }
}
