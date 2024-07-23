import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import socketServer from './socketServer';

const app = express();
app.use(cors({ origin: '*' }));
dotenv.config();

const httpServer = http.createServer(app);

socketServer(httpServer);

httpServer.listen(5000, () => console.log('App listining to port 5000'));