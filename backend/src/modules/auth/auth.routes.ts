import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();


router.post('/google', AuthController.googleLogin);


router.post('/logout', AuthController.logout);

export default router;