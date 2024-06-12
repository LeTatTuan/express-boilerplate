'use strict';
import 'dotenv/config';
import express from 'express';
import router from '@/config/routes.config';
import appConfig from '@/config/app.config';
import instanceMongodb from './config/database.config';
import helmet from 'helmet';
import configCors from '@/config/cors.config';

const {
  app: { port },
} = appConfig;
const app = express();

app.use(helmet());

configCors(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, () => {
  console.log('------------ new request -----------------');
  console.log(`server is running at: http://localhost:${port}`);
});
