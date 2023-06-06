export default {
    type: ['Gauge','Gauge','Gauge'],
    name: ['mx_price','mx_top_up_apr', 'mx_base_apr'],
    help: ['MX price', 'MX topUpApr', 'MX baseApr'],
    url: [
        'https://api.multiversx.com/economics',
    ],
    method: 'get',
    callback: (response, prometheus) => {
        prometheus['mx_price'].set(response.data.price);
        prometheus['mx_top_up_apr'].set(response.data.topUpApr);
        prometheus['mx_base_apr'].set(response.data.baseApr);
    }
}
