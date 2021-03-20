import * as mongoose from 'mongoose';
import { Socket } from 'socket.io';
import app from './app';
import { getChatRoomInfo, joinChatRoom, saveMessage } from './controllers/chatRoomController';

// DB connection
mongoose
	.connect(process.env.MONGO_URL!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('mongoDB connected!'));

const PORT = process.env.PORT || 4000;

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

// socket server
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(server, {
	cors: {
		origin: true,
	},
});

io.on('connection', (socket: Socket) => {
	socket.on('userLogin', ({ myRooms }) => {
		if (!myRooms) {
			return;
		}
		myRooms.forEach((room: any) => {
			socket.join(room.id);
		});
	});

	socket.on('joinRoom', async ({ roomId }: { roomId: string }) => {
		const { roomUsers, roomChats } = await getChatRoomInfo(roomId);

		socket.emit('roomInfo', { roomUsers, roomChats });
	});

	socket.on('messageToServer', async ({ userId, roomId, message }) => {
		const { status, newMessage } = await saveMessage(userId, roomId, message);
		if (status === 'success') {
			io.to(roomId).emit('messageFromServer', { newMessage });
		}
	});

	socket.on('newUserJoin', async ({ roomId, user }) => {
		const result = await joinChatRoom(roomId, user);
		if (result) {
			io.to(roomId).emit('newUserJoinFromServer', { roomId, user });
		}
	});
});

export default io;
