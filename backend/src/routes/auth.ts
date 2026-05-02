import { Router } from 'express';
import {
  auth,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/auth';

const authRouter = Router();

authRouter.post('/auth/register', registerUser);
authRouter.post('/auth/login', loginUser);
authRouter.get('/auth/token', refreshAccessToken);
authRouter.get('/auth/logout', logoutUser);
authRouter.get('/auth/user', auth, getCurrentUser);

export default authRouter;
