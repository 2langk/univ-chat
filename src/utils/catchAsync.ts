import { RequestHandler } from 'express';

const catchAsync = (fn: any): RequestHandler => (req, res, next) => {
	fn(req, res, next).catch(next);
};

export default catchAsync;
