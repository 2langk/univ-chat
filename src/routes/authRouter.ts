import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/me', authController.mustLogin, authController.getMe);

export default router;
