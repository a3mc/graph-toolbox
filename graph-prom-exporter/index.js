import express from 'express';
import Prometheus from 'prom-client';
import axios, {CancelToken} from 'axios';
import * as dotenv from 'dotenv';
import * as configs from './config-index.js';
import async from 'async';
import sslChecker from "ssl-checker";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 9090);
const timeout = Number(process.env.TIMEOUT || 5000)

// Count any network or other errors
const errorsCounter = new Prometheus.Counter({
    name: (process.env.PROMETHEUS_PREFIX || '') + 'check_errors',
    help: 'Graph check errors',
});

// Use it to store global state variable, like last block number
global.state = {};

const requests = await configs.default;

// Process configs and create Prometheus objects.
for (const [i, request] of requests.entries()) {
    const prometheusObject = {};

    request.prometheus = request.type.map((type, j) => {
        const options = {
            name: (process.env.PROMETHEUS_PREFIX || '') + request.name[j],
            help: request.help[j],
        }
        if (type === 'Gauge') {
            options.labelNames = ['id', 'name'];
        }
        const prometheus = new Prometheus[type](options);
        prometheusObject[request.name[j]] = prometheus;
        return prometheus;
    });
    request.prometheus = prometheusObject;
}

// Return cached metrics if we are already fetching them.
let isFetching = false;
let cachedMetrics = null;
const cache = {};

// This endpoint is called by Prometheus to get the metrics.
app.get('/metrics', async (req, res) => {
    if (isFetching) {
        res.set('Content-Type', Prometheus.register.contentType);
        res.end(cachedMetrics);
        return;
    }
    isFetching = true
    try {
        await fetchRequests();
        const metrics = await Prometheus.register.metrics();
        res.set('Content-Type', Prometheus.register.contentType);
        cachedMetrics = metrics;
        res.end(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    } finally {
        isFetching = false;
    }
});

// This function is called every time the /metrics endpoint is called.
export async function fetchRequests() {
    const queue = [];
    for (const request of requests) {
        if (!Array.isArray(request.url)) {
            request.url = [request.url]
        }
        if (request.checkSSL) {
            for (const url of request.url) {
                queue.push(async () => {
                    try {
                        let response;
                        await Promise.race([
                            sslChecker(new URL(url).hostname, 'GET', 443)
                                .then(result => response = result),
                            new Promise((resolve, reject) => setTimeout(
                                () => {
                                    reject(new Error('Timeout for ' + url))
                                },
                                timeout
                            ))
                        ]);
                        request.callback(response, request.prometheus);
                    } catch (err) {
                        console.error('Error fetching ' + url)
                        errorsCounter.inc();
                    }
                });
            }
        } else {
            for (const url of request.url) {

                queue.push(async () => {
                    const source = CancelToken.source();

                    if (request.cache) {
                        if ( cache[url] ) {
                            return request.callback(cache[url], request.prometheus);
                        } else {
                            setTimeout( () => {
                                delete cache[url];
                            }, request.cache)
                        }
                    }

                    const axiosPromise = axios[request.method || 'post'](
                        url,
                        request.query ? {query: request.query} : null,
                        {
                            timeout: timeout,
                            keepAlive: true,
                            cancelToken: source.token,
                            headers: request.headers || {}
                        }
                    );

                    const timeoutPromise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            source.cancel('Request timed out');
                            reject(new Error('Request timed out'));
                        }, timeout);
                    });

                    try {
                        const response = await Promise.race([
                            axiosPromise,
                            timeoutPromise
                        ]);
                        if (request.cache) {
                            cache[url] = response;
                        }
                        request.callback(response, request.prometheus);
                    } catch (error) {
                        console.error('Error fetching ' + url + ':', error.message);
                        errorsCounter.inc();
                    }
                });
            }
        }
    }
    await async.parallelLimit(queue, Number(process.env.PARALLEL_LIMIT || 10));
}

app.listen(port, '0.0.0.0', async () => {
    console.log(`Graph-check prom exporter is listening at port ${port}`);
});

export default app;
