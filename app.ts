import express, { Express } from 'express';

import compression from 'compression';
import cors from 'cors'
import dotenv from 'dotenv';
import http from 'http';
import statusCodes from 'http-status-codes';
import path from "path";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import setupWebSocket from "./src/Socket";
import routes from './src/routes/Auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.enable('trust proxy'); 

const accessLogStream = createStream('access.log', {
    interval: '1d', 
    path: path.join(__dirname, 'log')
});

app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(compression({ level: 6, threshold: 0 }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
setupWebSocket(server);


app.use('/api', routes);
app.use('*', (req, res) => { res.status(statusCodes.OK).send({ st: 'true' }) });

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});