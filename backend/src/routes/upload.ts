import { Router } from 'express';
import path from 'path';
import multer from 'multer';
import uploadController from '../controllers/upload';
import auth from '../middlewares/auth';
import BadRequestError from '../errors/bad-request-error';

const uploadRouter = Router();

const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'xml'];

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../temp'),
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
    const extention = path.extname(file.originalname);
    const fileName = uniqueSuffix + extention;

    (req as any).fileInfo = {
      originalName: file.originalname,
      fileName,
    };

    callback(null, fileName);
  },
});

const fileMiddleware = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (req, file, callback) => {
    const isValidMimeType = file.mimetype.includes('image');
    const extension = path.extname(file.originalname);
    const isValidExtension = allowedExtensions.includes(extension);

    if (isValidMimeType && isValidExtension) {
      return callback(null, true);
    }
    return callback(new BadRequestError('Invalid file'));
  },
});

uploadRouter.post('/upload', auth, fileMiddleware.single('file'), uploadController);

export default uploadRouter;
