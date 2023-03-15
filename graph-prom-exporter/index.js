import express from 'express';
import Prometheus from 'prom-client';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as configs from './config-index.js';
import async from 'async';
import sslChecker from "ssl-checker";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 9090);

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
        if (request.checkSSL) {
            if (Array.isArray(request.url)) {
                for (const url of request.url) {
                    queue.push(async () => {
                        sslChecker( new URL(url).hostname, 'GET', 443 ).then(
                            response => { request.callback(response, request.prometheus); }
                        ).catch(err => {
                            console.error(err)
                            errorsCounter.inc();
                        });
                    } );
                }
                continue;
            }
            queue.push(async () => {
                sslChecker( new URL(request.url).hostname, 'GET', 443 ).then(
                    response => { request.callback(response, request.prometheus); }
                ).catch(err => {
                    console.error(err)
                    errorsCounter.inc();
                });
            } );
        } else {
            queue.push(async () => {
                try {
                    const response = await axios[request.method || 'post'](
                        request.url,
                        request.query ? {query: request.query} : null,
                        {
                            timeout: Number(process.env.TIMEOUT || 10000),
                            keepAlive: true,
                        }
                    );
                    request.callback(response, request.prometheus);
                } catch (err) {
                    console.error(err);
                    errorsCounter.inc();
                }
            })
        }
    }
    await async.parallelLimit(queue, Number(process.env.PARALLEL_LIMIT || 10));
}

app.listen(port, '0.0.0.0', async () => {
    console.log(`Graph-check prom exporter is listening at port ${port}`);
});

export default app;
