export default {
    type: ['Gauge','Gauge','Gauge','Gauge','Gauge','Gauge','Gauge','Gauge', 'Gauge'],
    name: ['mx_shards','mx_blocks', 'accounts', 'transactions', 'scResults', 'refreshRate', 'epoch', 'roundsPassed', 'roundsPerEpoch'],
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
        prometheus['scResults'].set(response.data.scResults);
        prometheus['refreshRate'].set(response.data.refreshRate);
        prometheus['epoch'].set(response.data.epoch);
        prometheus['roundsPassed'].set(response.data.roundsPassed);
        prometheus['roundsPerEpoch'].set(response.data.roundsPerEpoch);
    }
}
