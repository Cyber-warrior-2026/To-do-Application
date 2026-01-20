import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

//OAuth Login
router.post('/google', AuthController.googleLogin);

//Register and Login without OAuth
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

//Logout
router.post('/logout', AuthController.logout);

export default router;