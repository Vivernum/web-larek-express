import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import cors from 'cors';

import errorsHandler from './middlewares/error-handler';
import router from './routes/index';
import requestLogger from './middlewares/requestLogger';
import errorLogger from './middlewares/errorLogger';

import { DB_ADDRESS, PORT } from './config';

const app = express();
mongoose.connect(DB_ADDRESS as string);

const publicPath = path.join(__dirname, '../public');

app.use(requestLogger);

app.use(cors());
app.use(express.static(publicPath));
app.use(express.json());

app.use('/', router);

app.use(errorLogger, errorsHandler);

app.listen(PORT, () => console.log('Server is running'));
