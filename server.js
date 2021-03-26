import express from 'express';
import {configureRouter} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import {AkvarioServer} from "./scripts/AkvarioServer.js";

const server = express();
const HTTPServer = createServer(server);

const port = process.env.PORT || 3000;

const akvarioServer = new AkvarioServer(HTTPServer);

const router = configureRouter(express.Router());

server.use(bodyParser.json())
server.use(express.static('public'));
server.use('/', router);

//listens to PORT set on top.
HTTPServer.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});