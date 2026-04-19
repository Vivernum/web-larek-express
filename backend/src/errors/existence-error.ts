import CustomError from './custom-error';

class ExistenceError extends CustomError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default ExistenceError;
