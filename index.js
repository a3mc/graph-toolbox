import express from 'express';
import Prometheus from 'prom-client';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as configs from './config-index.js';
import async from "async";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 9090);

const errorsCounter = new Prometheus.Counter({
    name: 'graph_check_errors',
    help: 'Graph check errors',
});

// Use it to store global state variable, like last block number
global.state = {};

const requests = await configs.default;

for (const [i, request] of requests.entries()) {
    const prometheusObject = {};

    request.prometheus = request.type.map((type, j) => {
        const prometheus = new Prometheus[type]({
            name: request.name[j],
            help: request.help[j],
            labelNames: ['id', 'name'],
        });
        prometheusObject[request.name[j]] = prometheus;
        return prometheus;
    });
    request.prometheus = prometheusObject;
}


let isFetching = false;
let cachedMetrics = null;

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

async function fetchRequests() {
    const queue = [];
    for (const request of requests) {
        queue.push( async() => {
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
    await async.parallelLimit(queue, Number(process.env.PARALLEL_LIMIT || 10));
}

app.listen(port, '0.0.0.0', async () => {
    console.log(`Graph-check prom exporter is listening at port ${port}`);
});
