import { IError } from '../types/errors';

abstract class CustomError extends Error implements IError {
  public statusCode!: number;

  constructor(message: string) {
    super(message);
  }
}

export default CustomError;
