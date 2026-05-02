import dotenv from 'dotenv';

dotenv.config();

export const {
  DB_ADDRESS,
  PORT = 3000,
  JWT_REFRESH_SECRET_KEY,
  JWT_ACCESS_SECRET_KEY,
} = process.env;
