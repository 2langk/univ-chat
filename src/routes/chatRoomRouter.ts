import { Router } from 'express';
import { mustLogin } from '../controllers/authController';
import {
	createChatRoom,
	getAllChatRooms,
	getMyChatRooms,
	joinChatRoom,
	exitChatRoom,
} from '../controllers/chatRoomController';

const router = Router();

router.use(mustLogin);

router.post('/', createChatRoom);
router.get('/', getAllChatRooms);

router.get('/my', getMyChatRooms);
router.route('/:id').post(joinChatRoom);
router.route('/:id').delete(exitChatRoom);

export default router;
