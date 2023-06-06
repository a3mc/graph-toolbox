export default {
    type: ['Gauge','Gauge','Gauge','Gauge','Gauge','Gauge','Gauge','Gauge', 'Gauge'],
    name: ['mx_shards','mx_blocks', 'accounts', 'transactions', 'sc_results', 'refresh_rate', 'epoch', 'rounds_passed', 'rounds_per_epoch'],
    help: ['MX shards', 'MX blocks', 'MX accounts', 'MX transactions', 'MX scResults', 'MX refreshRate', 'MX epoch', 'MX roundsPassed', 'MX roundsPerEpoch'],
    url: [
        'https://api.multiversx.com/stats',
    ],
    method: 'get',
    callback: (response, prometheus) => {
        prometheus['mx_shards'].set(response.data.shards);
        prometheus['mx_blocks'].set(response.data.blocks);
        prometheus['accounts'].set(response.data.accounts);
        prometheus['transactions'].set(response.data.transactions);
        prometheus['sc_results'].set(response.data.scResults);
        prometheus['refresh_rate'].set(response.data.refreshRate);
        prometheus['epoch'].set(response.data.epoch);
        prometheus['rounds_passed'].set(response.data.roundsPassed);
        prometheus['rounds_per_epoch'].set(response.data.roundsPerEpoch);
    }
}
