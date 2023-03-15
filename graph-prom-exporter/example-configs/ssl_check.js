// This config checks the SSL certificate of the specified site, for example an indexer web endpoint.
export default {
    type: ['Gauge', 'Gauge', 'Gauge', 'Gauge'],
    name: [
        'indexer_site_ssl_days_left',
        'indexer_site_ssl_valid',
        'indexer_site_ssl_valid_till',
        'indexer_sites_ssl'
    ],
    help: [
        'Days left for Indexer Site SSL Certificate',
        'Is Indexer Site SSL Certificate valid',
        'Indexer Site SSL Certificate valid till',
        'Indexer sites for which SSL is set up'
    ],
    url: process.env.INDEXER_URL,
    checkSSL: true,
    callback: (response, prometheus) => {
        prometheus['indexer_site_ssl_days_left'].set(response.daysRemaining);
        prometheus['indexer_site_ssl_valid'].set(response.valid ? 1: 0);
        prometheus['indexer_site_ssl_valid_till'].set(Date.parse(response.validTo));
        for ( const site of response.validFor ) {
            prometheus['indexer_sites_ssl'].labels('sites', site).set(1);
        }
    }
}
