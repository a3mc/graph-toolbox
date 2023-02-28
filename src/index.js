import requests from './collection.js';
import express from 'express';
import Prometheus from 'prom-client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = Number(process.env.PORT);

const errorsCounter = new Prometheus.Counter({
    name: 'graph_check_errors',
    help: 'Graph check errors',
});

for (const request of requests) {
    if (typeof request.type !== 'string') {
        request.prometheus = [];
        for (let i = 0; i < request.type.length; i++) {
            request.prometheus.push(new Prometheus[request.type[i]]({
                name: request.name[i],
                help: request.help[i],
                labelNames: ['id', 'name'],
            }));
        }
    } else {
        request.prometheus = new Prometheus[request.type]({
            name: request.name,
            help: request.help,
        });
    }
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
    for (const request of requests) {
        try {
            const response = await axios[request.method || 'post'](
                request.url,
                request.query ? {query: request.query} : null,
                {timeout: Number(process.env.TIMEOUT)}
            );
            request.callback(response, request.prometheus);
        } catch (err) {
            console.error(err);
            errorsCounter.inc();
        }
    }
}

// Prometheus.collectDefaultMetrics();
app.listen(port, async () => {
    console.log(`Graph-check prom exporter is listening at port ${port}`);
});
