export default {
    type: ['Gauge','Gauge','Gauge','Gauge','Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge', 'Gauge'],
    name: [
        'mx_serviceFee', 'mx_delegationCap', 'mx_apr', 'mx_numUsers', 'mx_cumulatedRewards',
        'mx_numNodes', 'mx_stake', 'mx_topUp', 'mx_locked', 'mx_featured', 'mx_automaticActivation',
        'mx_initialOwnerFunds', 'mx_checkCapOnRedelegate', 'mx_totalUnStaked', 'mx_createdNonce'
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
        prometheus['mx_serviceFee'].set(response.data.serviceFee);
        prometheus['mx_delegationCap'].set( Number(response.data.delegationCap) / denom);
        prometheus['mx_apr'].set(response.data.apr);
        prometheus['mx_numUsers'].set(response.data.numUsers);
        prometheus['mx_cumulatedRewards'].set(Number(response.data.cumulatedRewards) / denom);
        prometheus['mx_numNodes'].set(response.data.numNodes);
        prometheus['mx_stake'].set(Number(response.data.stake) / denom);
        prometheus['mx_topUp'].set(Number(response.data.topUp) / denom);
        prometheus['mx_locked'].set(Number(response.data.locked) / denom);
        prometheus['mx_featured'].set(response.data.featured ? 1 : 0);
        prometheus['mx_automaticActivation'].set(response.data.automaticActivation ? 1 : 0);
        prometheus['mx_initialOwnerFunds'].set(Number(response.data.initialOwnerFunds) / denom);
        prometheus['mx_checkCapOnRedelegate'].set(response.data.checkCapOnRedelegate ? 1 : 0);
        prometheus['mx_totalUnStaked'].set(Number(response.data.totalUnStaked) / denom);
        prometheus['mx_createdNonce'].set(response.data.createdNonce);
    }
}
