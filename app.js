import express from 'express';
import {configureRouter} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import * as socket_io from 'socket.io';
import {handleConnection} from "./scripts/sockets.js";
import {UserProperties} from "./scripts/user.js";

const app = express();
const server = createServer(app);
const io = new socket_io.Server(server);

const port = process.env.PORT || 3000;

const userData = new UserProperties();
//userData.add('1','Simon', 'red', {top: 500, left: 500}, 2);

const router = configureRouter(express.Router(), userData.toJSON());
app.use(bodyParser.json())
app.use('/', router);

io.on('connection', socket => handleConnection(socket, userData));

//listens to PORT set on top.
server.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});