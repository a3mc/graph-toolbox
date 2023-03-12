// This example just checks the health of the web endpoint of the indexer.
// It will increment the counter if the web endpoint is down.
export default {
    type: ['Counter'],
    name: ['indexer_url_downtime_counter'],
    help: ['Downtime counter of indexer URL'],
    url: process.env.INDEXER_URL,
    method: 'get',
    callback: (response, prometheus) => {
        if ( response.status !== 200 ) {
            prometheus['indexer_url_downtime_counter'].inc();
        }
    }
}
