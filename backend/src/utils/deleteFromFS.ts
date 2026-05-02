import fs from 'fs';
import path from 'path';
import { ProductDocument } from '../types/product';
import IternalError from '../errors/iternal-error';

const deleteFromFS = async (doc: ProductDocument) => {
  try {
    await fs.promises.unlink(path.join(__dirname, '../../public', doc.image.fileName));
  } catch (error) {
    throw new IternalError('Internal server error');
  }
};

export default deleteFromFS;
