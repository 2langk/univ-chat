// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from 'supertest';
import app from '../app';

test('register', async () => {
	await request(app)
		.post('/api/auth/register')
		.send({
			name: 'test',
			email: 'email@email.com',
			password: '123123',
			passwordCheck: '123123',
			university: '123',
		})
		.expect(200);
});

test('login', async () => {
	await request(app)
		.post('/api/auth/login')
		.send({
			email: 'email@email.com',
			password: '123123',
		})
		.expect(200);
});

test('get current user', async () => {
	const token = await global.login();

	await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(200);
});
