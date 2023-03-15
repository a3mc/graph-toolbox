// This example just checks the health of the web endpoint of the indexer.
// It returns the HTTP status code of the endpoint.
export default {
    type: ['Gauge'],
    name: ['endpoint_healthcheck'],
    help: ['Status code of web endpoints'],
    // Can be an array of URLs.
    url: [
        process.env.INDEXER_URL,
    ],
    method: 'get',
    callback: (response, prometheus) => {
        const hostname = new URL(response.config.url).hostname;
        prometheus['endpoint_healthcheck'].labels('status',hostname ).set(response.status);
    }
}
