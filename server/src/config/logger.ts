import path from 'path';
import winston from 'winston';
import { env } from './env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logsDir = path.join(__dirname, '..', '..', 'logs');

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return stack ? `${ts} [${level}]: ${message}\n${stack}` : `${ts} [${level}]: ${message}`;
  })
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.logLevel,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

/**
 * Stream object used by morgan so HTTP access logs flow through winston
 * instead of writing directly to stdout.
 */
export const httpLoggerStream = {
  write: (message: string) => logger.http(message.trim()),
};
