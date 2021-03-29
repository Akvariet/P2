import express from 'express';
import {router} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import {AkvarioServer} from "./scripts/AkvarioServer.js";

const server = express();
const HTTPServer = createServer(server);

// port range: 3200-3209
const port = process.env.PORT || 3200;
const PeerJSOptions = { port:3201 }

const akvarioServer = new AkvarioServer(HTTPServer, PeerJSOptions);



server.use(bodyParser.json())
server.use(express.static('public'));
server.use(router);

//listens to PORT set on top.
HTTPServer.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});