import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import IternalError from '../errors/iternal-error';

const uploadController = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  if (!file) {
    return next(new Error('No file uploaded'));
  }

  const { fileName, originalName } = (req as any).fileInfo;

  try {
    await fs.promises.rename(file.path, path.join(__dirname, '../../public/images', fileName));
    return res.status(200).send({
      fileName: `/images/${fileName}`,
      originalName,
    });
  } catch (error) {
    return next(new IternalError('Internal server error'));
  }
};

export default uploadController;
