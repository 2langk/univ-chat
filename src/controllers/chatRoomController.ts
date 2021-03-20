import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import ChatRoom from '../models/ChatRoom';
import ChatRoomUser from '../models/ChatRoomUser';
import Chat from '../models/Chat';
import io from '../server';

export const createChatRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { name, category, description, university } = req.body;

	const newChatRoom = await ChatRoom.create({
		name,
		category,
		description,
		university,
	});

	await ChatRoomUser.create({
		chatRoom: newChatRoom.id,
		user: req.user!.id,
	});
	res.status(200).json({
		newChatRoom,
	});
});

export const getAllChatRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const chatRooms = await ChatRoom.find({});

	res.status(200).json({
		chatRooms,
	});
});

export const getMyChatRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const myChatRooms = await ChatRoomUser.find({ user: req.user!.id }).populate({
		path: 'chatRoom',
	});

	res.status(200).json({
		chatRooms: myChatRooms.map((i) => i.chatRoom),
	});

	// const myChatRooms = await User.findOne({ _id: req.user?.id }).populate({
	// 	path: 'myRooms',
	// 	model: 'ChatRoomUser',
	// 	populate: {
	// 		path: 'chatRoom',
	// 	},
	// });

	// res.status(200).json({
	// 	myChatRooms,
	// });
});

export const joinChatRoom = async (roomId: any, user: any) => {
	const chatRoom = await ChatRoom.findById(roomId);

	if (!chatRoom || !['all', user.university].includes(chatRoom.university)) return false;
	await ChatRoomUser.create({ chatRoom: roomId, user: user.id });
	return true;
};

export const getChatRoomInfo = async (roomId: string) => {
	const roomUsers = await ChatRoomUser.find({ chatRoom: roomId }).populate('user');
	const roomChats = await Chat.find({ chatRoom: roomId }).populate('user');

	return {
		roomUsers,
		roomChats,
	};
};

export const saveMessage = async (userId: string, roomId: string, message: string) => {
	await Chat.create({ chatRoom: roomId, user: userId, message });

	const newMessage = await Chat.findOne({ chatRoom: roomId, user: userId, message })
		.populate('user')
		.populate('chatRoom');

	let status;
	if (newMessage) {
		status = 'success';
	} else {
		status = 'fail';
	}

	return {
		status,
		newMessage,
	};
};

export const exitChatRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const isJoined = await ChatRoomUser.findOne({ chatRoom: req.params.id, user: req.user!.id });

	if (!isJoined) return next(new AppError('12', 400));

	await isJoined.delete();
	io.to(req.params.id).emit('userLeaveFromServer', { roomId: req.params.id, user: req.user });
	res.status(200).json({
		status: 'success',
	});
});
