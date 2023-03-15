// This config checks the SSL certificate of the specified site, for example an indexer web endpoint.
export default {
    type: ['Gauge'],
    name: ['ssl_checks'],
    help: ['SSL certificates checks'],
    // URL can be a string or an array of strings, if you use it with checkSSL:true.
    url: [
        process.env.INDEXER_URL,
    ],
    checkSSL: true,
    callback: (response, prometheus) => {
        for (const site of response.validFor) {
            prometheus['ssl_checks'].labels('days_left', site).set(response.daysRemaining);
            prometheus['ssl_checks'].labels('valid', site).set(response.valid ? 1 : 0);
            prometheus['ssl_checks'].labels('valid_till', site).set(Date.parse(response.validTo));
        }
    }
}
