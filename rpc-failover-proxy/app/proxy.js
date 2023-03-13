import * as dotenv from 'dotenv';
import httpProxy from 'http-proxy';
import logger from './logger.js';
import http from 'http';
import bodyParser from 'body-parser';
import Prometheus from 'prom-client';
import * as https from 'https';

dotenv.config();

export class Proxy {
    port = Number(process.env.PORT || 8545);
    timeout = Number(process.env.TIMEOUT | 10000);
    proxy = httpProxy.createProxyServer({});
    httpAgent = new http.Agent({keepAlive: true});
    httpsAgent = new https.Agent({keepAlive: true});
    proxyOptions = {
        target: null,
        timeout: this.timeout,
        proxyTimeout: this.timeout,
        secure: false,
        rejectUnauthorized: false,
        changeOrigin: true,
        keepAlive: true,
        agent: null,
    };

    constructor(health, metrics) {
        this._health = health;
        this._metrics = metrics;
        this.proxy.on('error', (err, req, res) => this.proxyError(err, req, res));
        this.proxy.on('proxyReq', (proxyReq, req, res) => this.proxyReq(proxyReq, req, res));
        this.proxy.on('proxyRes', (proxyRes, req, res) => this.proxyRes(proxyRes, req, res));
        this.startServer();
    }

    startServer() {
        this.server = http.createServer((req, res) => {
            this.makeRequest(req, res);
            this._metrics.metrics.totalProxyRequests.inc();
        });

        this.server.listen(this.port, () => {
            logger.info('Proxy server listening on port %d', this.port);
        });
    }

    makeRequest(req, res) {
        if (req.url.slice(-1) === '/') {
            req.url = req.url.slice(0, -1);
        }
        const proxyOptions = Object.assign({}, this.proxyOptions);
        proxyOptions.target = this._health.getHealthyNode();
        proxyOptions.headers = req.headers;
        req.proxyUrl = proxyOptions.target;

        if (!proxyOptions.target) {
            logger.error('No healthy nodes available.');
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end();
            return;
        }

        const targetProtocol = new URL(proxyOptions.target).protocol;
        if (targetProtocol === 'https:') {
            proxyOptions.agent = this.httpsAgent;
        } else {
            proxyOptions.agent = this.httpAgent;
        }

        bodyParser.json()(req, res, () => {
            this.proxy.web(req, res, proxyOptions);
        });
    }

    proxyError(err, req, res) {
        const targetUrl = req.proxyUrl;
        logger.error(`Proxy error for target node ${targetUrl}: ${err}`);
        this._health.reportNode(targetUrl);
        this.makeRequest(req, res);
    }

    proxyReq(proxyReq, req, res) {
        const bodyData = JSON.stringify(req.body);
        logger.debug(req.method + ' ' + bodyData);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }

    proxyRes(proxyRes, req, res) {
        if (proxyRes.statusCode === 200) {
            this._metrics.metrics.successfulRpcRequests.inc();
        }
        logger.debug(proxyRes.statusCode);
    }
}
