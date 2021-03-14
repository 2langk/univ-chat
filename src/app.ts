import * as express from 'express';
import * as dotenv from 'dotenv';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import globalErrorHandler from './utils/globalErrorHandler';
import AppError from './utils/AppError';
import logger from './utils/logger';
import authRouter from './routes/authRouter';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = express();

app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
app.use('/api/auth', authRouter);

app.all('*', (req, res, next) => {
	return next(new AppError(`올바르지 않은 URL입니다!`, 404));
});

// Error Hanlder
app.use(globalErrorHandler);

export default app;
