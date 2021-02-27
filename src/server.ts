import * as express from 'express';
import * as dotenv from 'dotenv';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import globalErrorHandler from './utils/globalErrorHandler';
import AppError from './utils/AppError';
import logger from './utils/logger';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(helmet());
app.use(compression());

// Limit requests from same API
app.use(
	rateLimit({
		max: 10000,
		windowMs: 60 * 60 * 1000,
		message: 'Too many requests!',
	})
);

// custom logger
app.use((req, res, next) => {
	logger.info({ message: `Request is ${req.method} - ${req.originalUrl} ` });
	next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.all('*', (req, res, next) => {
	return next(new AppError(`올바르지 않은 URL입니다!`, 404));
});

// Error Hanlder
app.use(globalErrorHandler);

/* 
  DB connection
*/

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('SIGTERM RECEIVED!');
	server.close(() => {
		process.exit(1);
	});
});
