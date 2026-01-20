import { Router } from 'express';
import { AuthController } from './auth.controller';
import { verifyToken } from '../../middleware/auth.middleware'


const router = Router();

//OAuth Login
router.post('/google', AuthController.googleLogin);

//Register and Login without OAuth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

//Logout
router.post('/logout', AuthController.logout);

//Change Password
router.put('/change-password', verifyToken, AuthController.changePassword);

export default router;