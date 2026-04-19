import { Router } from 'express';

import { addProduct, getProducts } from '../controllers/product';

const productRouter = Router();

productRouter.get('/product', getProducts);
productRouter.post('/product', addProduct);

export default productRouter;
