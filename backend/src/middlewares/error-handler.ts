import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';

const errorsHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(err.statusCode).send(err.message);
  }
};

export default errorsHandler;
