import mongoose from 'mongoose';
import { IUser, Token } from '../types/user';

const tokenSchema = new mongoose.Schema<Token>({
  token: String,
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    type: tokenSchema,
  }],
});

export default mongoose.model<IUser>('user', userSchema);
