import { HydratedDocument } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price: number | null;
}

export type ProductDocument = HydratedDocument<IProduct>;
