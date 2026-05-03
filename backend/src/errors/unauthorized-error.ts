import CustomError from './custom-error';

class UnauthorizedError extends CustomError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
