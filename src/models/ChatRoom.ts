import * as mongoose from 'mongoose';

interface ChatRoomDoc extends mongoose.Document {
	id: mongoose.Types.ObjectId;
	name: string;
	category: string;
	description: string;
	university: string;
}

type ChatRoomModel = mongoose.Model<ChatRoomDoc>;

const chatRoomSchema = new mongoose.Schema<ChatRoomDoc, ChatRoomModel>(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		university: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

chatRoomSchema.virtual('chats', {
	ref: 'Chat',
	foreignField: 'chatRoom',
	localField: '_id',
});

const ChatRoom = mongoose.model<ChatRoomDoc>('ChatRoom', chatRoomSchema);

export default ChatRoom;
export { ChatRoomDoc };
