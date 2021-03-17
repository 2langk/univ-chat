// eslint-disable-next-line import/no-extraneous-dependencies
import * as request from 'supertest';
import app from '../app';

test('create Chat Room', async () => {
	const token = await global.login();

	await request(app)
		.post('/api/chatRoom')
		.set('Authorization', `Bearer ${token}`)
		.send({
			name: 'test',
			category: '123',
			description: '123',
			university: '123',
		})
		.expect(200);
});

test('get All Chat Rooms', async () => {
	const token = await global.login();

	await request(app).get('/api/chatRoom').set('Authorization', `Bearer ${token}`).expect(200);
});
