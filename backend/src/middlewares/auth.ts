import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { JWT_ACCESS_SECRET_KEY } from '../config';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    jwt.verify(token, JWT_ACCESS_SECRET_KEY!);
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Unauthorized'));
  }
};

export default auth;
