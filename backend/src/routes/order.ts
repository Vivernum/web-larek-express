import { Router } from 'express';
import postOrder from '../controllers/order';
import { validateOrderBody } from '../middlewares/validators';

const orderRouter = Router();

orderRouter.post('/order', validateOrderBody, postOrder);

export default orderRouter;
