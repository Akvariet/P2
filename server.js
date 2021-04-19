import express from 'express';
import {router} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import {AkvarioServer} from "./scripts/AkvarioServer.js";
import {port} from './scripts/serverConfig.js'
import * as user from './users.js'

const server = express();
const HTTPServer = createServer(server);
const akvarioServer = new AkvarioServer(HTTPServer);

server.use(bodyParser.json());
server.use(express.static('public'));
server.use(router);

export function attemptLogin(name, color){
    // Validate login information.

    // Create user.
    const newUser = user.create(name, color);

    if(newUser)
    // Return user ID and the user collection.
    if (name === 'hej')
        return undefined;
    else return {id: 1, users: users}
}




//listens to PORT set in /scripts/serverConfig.
HTTPServer.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});