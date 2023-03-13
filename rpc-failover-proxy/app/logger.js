import winston from 'winston';
import * as dotenv from 'dotenv';
dotenv.config();
export default winston.createLogger( {
    level: process.env.DEBUG_LEVEL ?? 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`),
    ),
    transports: [
        new winston.transports.File( { filename: './logs/error.log', level: 'error' } ),
        new winston.transports.File( { filename: './logs/warning.log', level: 'warning' } ),
        new winston.transports.File( { filename: './logs/combined.log' } ),
        new winston.transports.Console(),
    ],
} );

