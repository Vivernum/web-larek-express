import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import IternalError from '../errors/iternal-error';

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const {
    payment,
    email,
    phone,
    address,
    total,
    items,
  } = req.body;

  try {
    const result = await Product.aggregate([
      { $match: { _id: { $in: items.map((id: string) => new mongoose.Types.ObjectId(id)) } } },
      { $match: { price: { $ne: null } } },
    ]);

    const isPhoneValid = typeof phone === 'string';
    const isAdressValid = typeof address === 'string';
    const isEmailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    const isPaymentValid = payment === 'card' || payment === 'online';

    const totalPrice = result.reduce((acc, product) => acc + product.price!, 0);

    if (
      result.length !== items.length
      || total !== totalPrice
      || !isPhoneValid
      || !isAdressValid
      || !isEmailValid
      || !isPaymentValid
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
