import {Metrics} from './app/metrics.js';
import {Health} from './app/health-check.js';
import {Proxy} from './app/proxy.js';
import logger from "./app/logger.js";

const metrics = new Metrics();
const health = new Health(metrics);
const proxy = new Proxy(health, metrics);

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
const shutdown_timeout = Number(process.env.SHUTDOWN_TIMEOUT || 3000);

async function handleShutdown() {
    logger.info('Shutting down proxy server');
    const proxyServerPromise = new Promise((resolve, reject) => {
        proxy.server.close((error) => {
            if (error) {
                reject(error);
            } else {
                logger.info('Proxy Server shut down');
                resolve();
            }
        });
    });

    logger.info( 'Shutting down health server');
    health.isShuttingDown = true;
    health.cancelToken.source().cancel();
    const healthServerPromise = Promise.resolve();

    logger.info( 'Shutting down metrics server');
    const metricsServerPromise = new Promise((resolve, reject) => {
        metrics.server.close((error) => {
            if (error) {
                reject(error);
            } else {
                logger.info('Metrics Server shut down');
                resolve();
            }
        });
    });

    logger.debug('Waiting ' + shutdown_timeout + ' ms to close connections.');
    try {
        await Promise.all([
            proxyServerPromise,
            healthServerPromise,
            metricsServerPromise
        ]);
        logger.info('All servers shut down successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error shutting down servers, waiting for force quit. Err: ', error);
        process.exit(1);
    }

    setTimeout(() => {
        logger.info('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, Number(shutdown_timeout));
}
