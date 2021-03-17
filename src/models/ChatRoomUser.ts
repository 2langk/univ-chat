import * as mongoose from 'mongoose';

interface ChatRoomUserDoc extends mongoose.Document {
	id: mongoose.Types.ObjectId;
	chatRoom: mongoose.Types.ObjectId;
	ChatRoomUser: mongoose.Types.ObjectId;
}

type ChatRoomUserModel = mongoose.Model<ChatRoomUserDoc>;

const chatRoomUserSchema = new mongoose.Schema<ChatRoomUserDoc, ChatRoomUserModel>(
	{
		chatRoom: {
			type: mongoose.Types.ObjectId,
			ref: 'ChatRoom',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

chatRoomUserSchema.index({ chatRoom: 1, user: 1 }, { unique: true });

const ChatRoomUser = mongoose.model<ChatRoomUserDoc>('ChatRoomUser', chatRoomUserSchema);

export default ChatRoomUser;
export { ChatRoomUserDoc };
