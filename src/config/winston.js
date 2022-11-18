import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const fileLogTransport = new transports.DailyRotateFile({
  level: 'error',
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const consoleTransport = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.stack || JSON.stringify(info.message)}`),
  ),
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [consoleTransport, fileLogTransport],
});

export default logger;
