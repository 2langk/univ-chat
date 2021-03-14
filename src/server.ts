import * as mongoose from 'mongoose';
import app from './app';

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
