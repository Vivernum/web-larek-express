import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ExistenceError from '../errors/existence-error';
import IternalError from '../errors/iternal-error';

export const addProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    image,
    category,
    description,
    price,
  } = req.body;

  return Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err instanceof Error && err.message.includes('E11000')) {
        return next(new ExistenceError(err.message));
      }
      return next(new BadRequestError('Bad request'));
    });
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({}).select('-__v');
    return res.status(200).send({
      items,
      total: items.length,
    });
  } catch (err) {
    return next(new IternalError('Internal server error'));
  }
};
