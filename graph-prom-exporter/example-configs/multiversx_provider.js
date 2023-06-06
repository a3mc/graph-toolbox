export default {
    type: ['Gauge','Gauge','Gauge','Gauge','Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge'],
    name: [
        'mx_service_fee', 'mx_delegation_cap', 'mx_apr', 'mx_num_users', 'mx_cumulated_rewards',
        'mx_num_nodes', 'mx_stake', 'mx_top_up', 'mx_locked', 'mx_featured', 'mx_automatic_activation',
        'mx_initial_owner_funds', 'mx_check_cap_on_redelegate', 'mx_total_un_staked', 'mx_created_nonce'
    ],
    help: [
        'MX serviceFee', 'MX delegationCap', 'MX apr', 'MX numUsers', 'MX cumulatedRewards',
        'MX numNodes', 'MX stake', 'MX topUp', 'MX locked', 'MX featured', 'MX automaticActivation',
        'MX initialOwnerFunds', 'MX checkCapOnRedelegate', 'MX totalUnStaked', 'MX createdNonce'
    ],
    url: [
        'https://api.multiversx.com/providers/' + process.env.MX_PROVIDER,
    ],
    method: 'get',
    callback: (response, prometheus) => {
        const denom = 1000000000000000000;
        prometheus['mx_service_fee'].set(response.data.serviceFee);
        prometheus['mx_delegation_cap'].set( Number(response.data.delegationCap) / denom);
        prometheus['mx_apr'].set(response.data.apr);
        prometheus['mx_num_users'].set(response.data.numUsers);
        prometheus['mx_cumulated_rewards'].set(Number(response.data.cumulatedRewards) / denom);
        prometheus['mx_num_nodes'].set(response.data.numNodes);
        prometheus['mx_stake'].set(Number(response.data.stake) / denom);
        prometheus['mx_top_up'].set(Number(response.data.topUp) / denom);
        prometheus['mx_locked'].set(Number(response.data.locked) / denom);
        prometheus['mx_featured'].set(response.data.featured ? 1 : 0);
        prometheus['mx_automatic_activation'].set(response.data.automaticActivation ? 1 : 0);
        prometheus['mx_initial_owner_funds'].set(Number(response.data.initialOwnerFunds) / denom);
        prometheus['mx_check_cap_on_redelegate'].set(response.data.checkCapOnRedelegate ? 1 : 0);
        prometheus['mx_total_un_staked'].set(Number(response.data.totalUnStaked) / denom);
        prometheus['mx_created_nonce'].set(response.data.createdNonce);
    }
}
