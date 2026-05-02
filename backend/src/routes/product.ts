import { Router } from 'express';

import {
  addProduct,
  deleteProduct,
  getProducts,
  patchProduct,
} from '../controllers/product';
import { auth } from '../controllers/auth';
import { validateOjbectId, validateProductBody, validateProductUpdateBody } from '../middlewares/validators';

const productRouter = Router();

productRouter.get('/product', getProducts);
productRouter.post('/product', auth, validateProductBody, addProduct);

productRouter.patch('/product/:id', auth, validateOjbectId, validateProductUpdateBody, patchProduct);
productRouter.delete('/product/:id', auth, validateOjbectId, deleteProduct);

export default productRouter;
