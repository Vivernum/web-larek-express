import mongoose from 'mongoose';
import deleteProductFromFS from '../utils/deleteFromFS';
import { IImage, IProduct } from '../types/product';

const imageSchema = new mongoose.Schema<IImage>({
  fileName: String,
  originalName: String,
}, {
  _id: false,
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

productSchema.post('findOneAndDelete', deleteProductFromFS);

export default mongoose.model<IProduct>('product', productSchema);
