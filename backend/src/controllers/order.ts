import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import IternalError from '../errors/iternal-error';

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const {
    total,
    items,
  } = req.body;

  try {
    const result = await Product.aggregate([
      { $match: { _id: { $in: items.map((id: string) => new mongoose.Types.ObjectId(id)) } } },
      { $match: { price: { $ne: null } } },
    ]);

    const totalPrice = result.reduce((acc, product) => acc + product.price!, 0);

    if (
      result.length !== items.length
      || total !== totalPrice
    ) {
      return next(new BadRequestError('Bad request'));
    }

    res.send({
      id: faker.database.mongodbObjectId(),
      total: totalPrice,
    });
  } catch (err) {
    return next(new IternalError('Internal server error'));
  }
};

export default postOrder;
