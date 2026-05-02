import { p } from '@faker-js/faker/dist/airline-eVQV6kbz';
import { celebrate, Joi, Segments } from 'celebrate';

const productSchema = Joi.object({
  description: Joi.string(),
  title: Joi.string().required().min(2).max(30),
  price: Joi.number(),
  image: Joi.object({
    originalName: Joi.string().required(),
    fileName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
});

const productUpdateSchema = Joi.object({
  description: Joi.string(),
  title: Joi.string().min(2).max(30),
  price: Joi.number(),
  image: Joi.object({
    originalName: Joi.string().required(),
    fileName: Joi.string().required(),
  }),
  category: Joi.string(),
});

const objectIdShema = Joi.object({
  id: Joi.string().required(),
});

const orderSchema = Joi.object({
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).required(),
  payment: Joi.string().equal('card', 'online').required(),
});

export const validateProductBody = celebrate({
  [Segments.BODY]: productSchema,
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: productUpdateSchema,
});

export const validateOjbectId = celebrate({
  [Segments.PARAMS]: objectIdShema,
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: orderSchema,
});
