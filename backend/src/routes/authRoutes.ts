import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

router.post('/auth/sign-up', authController.signUp);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);

export default router;