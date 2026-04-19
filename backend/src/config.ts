import dotenv from 'dotenv';

dotenv.config();

export const { DB_ADDRESS, PORT = 3000 } = process.env;
