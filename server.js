import express from 'express';
import {router} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import {AkvarioServer} from "./scripts/AkvarioServer.js";
import {port} from './scripts/serverConfig.js'
import * as user from './users.js'

const server = express();
const HTTPServer = createServer(server);
const args = process.argv.slice(2);
new AkvarioServer(HTTPServer, args.includes('-T'));

server.use(bodyParser.json());
server.use(express.static('public'));
server.use(router);

//listens to PORT set in /scripts/serverConfig.
HTTPServer.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});


export function attemptLogin(name, color){

    if(!name)  throw 'No name specified.'
    if(!color) throw 'No color specified.'

    // Create user.
    const cid = user.create(name, color);
    if(cid === undefined)
        return undefined;
    const id = user.users[cid].gameID;

    // Return user ID and the user collection.
    return {id: id, cid: cid, users: user.exportUsers()}
}


