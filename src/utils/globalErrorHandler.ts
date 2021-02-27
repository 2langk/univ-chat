import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';
import logger from './logger';

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}
	// 1) Log error
	console.error('ERROR: ', err);

	// 2) Send generic message
	return res.status(500).json({
		status: 'error',
		message: 'Server Error, please try again'
	});
};

const sendErrorDev = (err: AppError, req: Request, res: Response) =>
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});

const globalErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// console.log(err.stack);
	const error = err as AppError;

	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, req, res);
		logger.error(error);
	} else if (process.env.NODE_ENV === 'production') {
		sendErrorProd(error, req, res);
		logger.error(error);
	}
};

export default globalErrorHandler;
