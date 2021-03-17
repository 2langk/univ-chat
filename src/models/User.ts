import * as mongoose from 'mongoose';

interface UserDoc extends mongoose.Document {
	id: mongoose.Types.ObjectId;
	name: string;
	email: string;
	password: string | undefined;
	university: string;
}

type UserModel = mongoose.Model<UserDoc>;

const userSchema = new mongoose.Schema<UserDoc, UserModel>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		university: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: 'default',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

userSchema.virtual('chats', {
	ref: 'Chat',
	foreignField: 'user',
	localField: '_id',
});

userSchema.virtual('myRooms', {
	ref: 'ChatRoomUser',
	foreignField: 'user',
	localField: '_id',
});

const User = mongoose.model<UserDoc>('User', userSchema);

export default User;
export { UserDoc };
