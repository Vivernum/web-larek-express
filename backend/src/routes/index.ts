import { Router } from 'express';
import productRouter from './product';
import orderRouter from './order';
import authRouter from './auth';

const router = Router();

router.use('/', productRouter);
router.use('/', orderRouter);
router.use('/', authRouter);

export default router;
