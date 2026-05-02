import { Router } from 'express';

import {
  addProduct,
  deleteProduct,
  getProducts,
  patchProduct,
} from '../controllers/product';
import { auth } from '../controllers/auth';

const productRouter = Router();

productRouter.get('/product', getProducts);
productRouter.post('/product', auth, addProduct);

productRouter.patch('/product/:id', auth, patchProduct);
productRouter.delete('/product/:id', auth, deleteProduct);

export default productRouter;
