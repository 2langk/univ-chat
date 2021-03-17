import * as mongoose from 'mongoose';

interface ChatDoc extends mongoose.Document {
	id: mongoose.Types.ObjectId;
	chatRoom: mongoose.Types.ObjectId;
	used: mongoose.Types.ObjectId;
	message: string;
}

type ChatModel = mongoose.Model<ChatDoc>;

const chatSchema = new mongoose.Schema<ChatDoc, ChatModel>(
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
		message: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model<ChatDoc>('Chat', chatSchema);

export default Chat;
export { ChatDoc };
