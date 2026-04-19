import { Router } from 'express';
import postOrder from '../controllers/order';

const orderRouter = Router();

orderRouter.post('/order', postOrder);

export default orderRouter;
