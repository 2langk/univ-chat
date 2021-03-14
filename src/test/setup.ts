// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import app from '../app';

beforeAll(async () => {
	mongoose.connect(process.env.MONGO_TEST_URL!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

global.login = async () => {
	const response = await request(app)
		.post('/api/auth/login')
		.send({
			email: 'email@email.com',
			password: '123123',
		})
		.expect(200);

	return response.body.token;
};
