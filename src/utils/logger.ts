import winston from 'winston';
import config from '../config';
import { format } from 'winston';

const LOG_FOLDER = "./logs"

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        winston.format.align(),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.cli()
            )
        }),
        new winston.transports.File({ 
            filename: `${LOG_FOLDER}/error.log`, 
            level: 'error',
            format: format.combine(
                format.json()
            ),
            maxsize: 5242880,
            maxFiles: 5,
            tailable: true
        }),
        new winston.transports.File({ 
            filename: `${LOG_FOLDER}/output.log`,
            format: format.combine(
                format.json()
            ),
            maxsize: 5242880,
            maxFiles: 5,
            tailable: true
        })
    ]
});

const debugTransport = new winston.transports.File({
    filename: `${LOG_FOLDER}/debug.log`,
    level: 'debug',
    format: format.combine(
        format.json()
    ),
    maxsize: 5242880,
    maxFiles: 5,
    tailable: true
});

if (config.logLevel === 'info') {
    logger.add(debugTransport);
}

export {logger}