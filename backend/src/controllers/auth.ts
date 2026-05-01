import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import IternalError from '../errors/iternal-error';
import ExistenceError from '../errors/existence-error';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import UnauthorizedError from '../errors/unauthorized-error';

const accessKey = 'some-secret-access-key';
const refreshKey = 'some-secret-refresh-key';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const accessToken = jwt.sign({ _id: user._id }, accessKey, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, refreshKey, { expiresIn: '30d' });
    const hashedRereshToken = await bcrypt.hash(refreshToken, 10);

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { $push: { tokens: { token: hashedRereshToken } } },
    );

    return res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    }).send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ExistenceError(error.message));
    }
    return next(new BadRequestError('Bad request'));
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new BadRequestError('Bad request'));
  }

  const accessToken = authorization.replace('Bearer ', '');
  let userId;

  try {
    userId = jwt.verify(accessToken, accessKey) as {
      _id: string
    };
  } catch (err) {
    return next(new NotFoundError('User not found'));
  }

  if (userId) {
    try {
      const result = await User.findById(userId._id).select('-__v -_id');
      return res.send({
        user: {
          email: result?.email,
          name: result?.name,
        },
        success: true,
      });
    } catch (err) {
      return next(new NotFoundError('User not found'));
    }
  }

  return next(new IternalError('Internal server error'));
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password -__v');

    if (!user) {
      return next(new UnauthorizedError('Data is incorrect'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new UnauthorizedError('Data is incorrect'));
    }

    const accessToken = jwt.sign({ _id: user._id }, accessKey, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, refreshKey, { expiresIn: '7d' });
    const hashedRereshToken = await bcrypt.hash(refreshToken, 10);

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { $push: { tokens: { token: hashedRereshToken } } },
    );

    return res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    }).send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new IternalError('Internal server error'));
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new BadRequestError('Bad request'));

  try {
    const isTokenValid = jwt.verify(refreshToken, refreshKey) as {
      _id: string
    };

    const tokens = await User.findById(isTokenValid._id).select('+tokens -__v -_id -name -email');

    if (!tokens) {
      return next(new NotFoundError('User not found'));
    }

    const validationResults = await Promise.allSettled(
      tokens.tokens.map(async (item) => {
        const isValid = await bcrypt.compare(refreshToken, item.token);
        if (isValid) {
          const result = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(isTokenValid._id) },
            { $pull: { tokens: { token: item.token } } },
          );
          return { isValid: true, modifiedCount: result.modifiedCount };
        }
        return { isValid: false, modifiedCount: 0 };
      }),
    );
    const successfulDeletion = validationResults.find(
      (item) => item.status === 'fulfilled' && item.value.modifiedCount > 0,
    );

    if (successfulDeletion) {
      return res.send({ success: true });
    }
    return next(new NotFoundError('User not found'));
  } catch (error) {
    return next(new BadRequestError('Bad request'));
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return next(new BadRequestError('Bad request'));
  let isTokenValid;

  try {
    isTokenValid = jwt.verify(refreshToken, refreshKey) as {
      _id: string
    };
  } catch (error) {
    return next(new UnauthorizedError('Token is expired'));
  }

  try {
    const userWithTokens = await User.findById(isTokenValid._id).select('+tokens -__v -_id');
    if (!userWithTokens) {
      return next(new NotFoundError('User not found'));
    }

    const { tokens } = userWithTokens;
    if (tokens.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    const validationResults = await Promise.allSettled(
      tokens.map(async (item) => {
        const isValid = await bcrypt.compare(refreshToken, item.token);
        if (isValid) {
          const result = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(isTokenValid._id) },
            { $pull: { tokens: { token: item.token } } },
          );
          return { isValid: true, modifiedCount: result.modifiedCount };
        }
        return { isValid: false, modifiedCount: 0 };
      }),
    );
    const successfulDeletion = validationResults.find(
      (item) => item.status === 'fulfilled' && item.value.modifiedCount > 0,
    );

    if (successfulDeletion) {
      const accessToken = jwt.sign({ _id: isTokenValid._id }, accessKey, { expiresIn: '10m' });
      const newRefreshToken = jwt.sign({ _id: isTokenValid._id }, refreshKey, { expiresIn: '7d' });
      const hashedRereshToken = await bcrypt.hash(newRefreshToken, 10);

      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(isTokenValid._id) },
        { $push: { tokens: { token: hashedRereshToken } } },
      );

      return res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      }).send({
        user: {
          email: userWithTokens.email,
          name: userWithTokens.name,
        },
        success: true,
        accessToken,
      });
    }
    return next(new NotFoundError('User not found'));
  } catch (err) {
    return next(new NotFoundError('User not found'));
  }
};
