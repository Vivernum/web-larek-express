import { Router } from 'express';
import path from 'path';
import multer from 'multer';
import uploadController from '../controllers/upload';
import { auth } from '../controllers/auth';

const uploadRouter = Router();

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
});

uploadRouter.post('/upload', auth, fileMiddleware.single('file'), uploadController);

export default uploadRouter;
