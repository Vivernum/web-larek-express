import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
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

export const patchProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new BadRequestError('Bad request'));
  }

  try {
    await Product.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: req.body },
    );

    const item = await Product.findById(id).select('-__v -_id');
    return res.status(200).send(item);
  } catch (error) {
    return next(new IternalError('Internal server error'));
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return next(new BadRequestError('Bad request'));
  }

  try {
    const result = await Product.findByIdAndDelete(id).select('-__v');
    return res.status(200).send(result);
  } catch (error) {
    return next(new IternalError('Internal server error'));
  }
};
