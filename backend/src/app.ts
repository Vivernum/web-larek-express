import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CronJob } from 'cron';
import { errors } from 'celebrate';

import errorsHandler from './middlewares/error-handler';
import router from './routes/index';
import requestLogger from './middlewares/requestLogger';
import errorLogger from './middlewares/errorLogger';

import { DB_ADDRESS, PORT } from './config';
import cleanUpTemp from './jobs/cleanUpTemp';

const app = express();
mongoose.connect(DB_ADDRESS as string);

const publicPath = path.join(__dirname, '../public');

app.use(requestLogger);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.static(publicPath));
app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.use(errorLogger, errors(), errorsHandler);

const job = new CronJob(
  '*/1 * * * *',
  cleanUpTemp,
  null,
  true,
);

app.listen(PORT, () => console.log('Server is running'));
