import CustomError from './custom-error';

class IternalError extends CustomError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

export default IternalError;
