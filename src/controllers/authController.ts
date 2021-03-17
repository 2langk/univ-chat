import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import User from '../models/User';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { name, email, password, passwordCheck, university } = req.body;

	if (password !== passwordCheck) return next(new AppError('', 400));

	const newUser = await User.create({
		name,
		email,
		password,
		university,
	});

	newUser.password = undefined;

	res.status(200).json({
		newUser,
	});
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select('+password');

	if (!user) return next(new AppError('유저를 찾을수 없습니다.', 400));

	if (user.password && password !== user.password) return next(new AppError('비밀번호가 다릅니다.', 400));

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRES_IN!,
	});

	user.password = undefined;
	res.cookie('jwt', token, {
		expires: new Date(Date.now() + 60 * 60 * 1000),
		httpOnly: true,
	});
	res.status(200).json({
		user,
	});
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) return next(new AppError('로그인이 필요합니다', 400));

	res.cookie(
		'jwt',
		{ log: 'out' },
		{
			expires: new Date(Date.now() + 100),
			httpOnly: true,
		}
	);

	res.status(200).json({});
});

export const mustLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	let token;

	if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) return next(new AppError('ERROR: Please Login', 400));

	const decode: any = jwt.verify(token, process.env.JWT_SECRET!);

	const currentUser = await User.findById(decode.id);

	if (!currentUser) return next(new AppError('ERROR: 미인증된 사용자입니다.', 400));

	req.user = currentUser;

	next();
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		user: req.user,
	});
});
