'use strict'
import 'dotenv/config';
import express from "express";
import router from "@/config/routes.config";
import appConfig from "@/config/app.config";
import instanceMongodb from './config/database.config';
import cookieparser from 'cookie-parser';
import cors from 'cors';


const { app: { port } } = appConfig;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser('MY SECRET'));
app.use(router)

app.listen(port, () => {
    console.log('------------ new request -----------------');
    console.log(`server is running at: http://localhost:${port}`);
})