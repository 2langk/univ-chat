import * as winston from 'winston';
import * as WinstonDaily from 'winston-daily-rotate-file';
import { join } from 'path';

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(
	// eslint-disable-next-line no-shadow
	({ timestamp, label, level, message }) =>
		`${timestamp} [${label}] ${level}: ${message}`
);

const logger = winston.createLogger({
	level: 'info',
	format: combine(
		label({ label: 'logs' }),
		timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		logFormat
	),
	// defaultMeta: { service: 'democracy-service' },
	transports: [
		new WinstonDaily({
			level: 'error',
			filename: `error.log`,
			dirname: join(__dirname, '../../logs/%DATE%'),
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		}),
		// new WinstonDaily({
		// 	level: 'warn',
		// 	filename: '%DATE%-warn.log',
		// 	dirname: join(__dirname, '../../logs/%DATE%'),
		// 	datePattern: 'YYYY-MM-DD',
		// 	zippedArchive: true,
		// 	maxSize: '20m',
		// 	maxFiles: '14d'
		// }),
		new WinstonDaily({
			level: 'info',
			filename: 'info.log',
			dirname: join(__dirname, '../../logs/%DATE%'),
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d' // 2주
		})
	],
	exceptionHandlers: [
		new WinstonDaily({
			level: 'exception',
			filename: 'exception.log',
			dirname: join(__dirname, '../../logs/%DATE%'),
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		})
	]
});

// if (process.env.NODE_ENV !== 'production') {
// 	logger.add(
// 		new winston.transports.Console({
// 			format: winston.format.combine(
// 				winston.format.simple(),
// 				winston.format.colorize()
// 			)
// 		})
// 	);
// }

export default logger;
