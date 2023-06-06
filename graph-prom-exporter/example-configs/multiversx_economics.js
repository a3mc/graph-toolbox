export default {
    type: ['Gauge','Gauge','Gauge'],
    name: ['mx_price','mx_topUpApr', 'mx_baseApr'],
    help: ['MX price', 'MX topUpApr', 'MX baseApr'],
    url: [
        'https://api.multiversx.com/economics',
    ],
    method: 'get',
    callback: (response, prometheus) => {
        prometheus['mx_price'].set(response.data.price);
        prometheus['mx_topUpApr'].set(response.data.topUpApr);
        prometheus['mx_baseApr'].set(response.data.baseApr);
    }
}
