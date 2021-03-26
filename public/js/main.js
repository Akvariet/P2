import {displayLoginScreen} from "./client.js";
import {ClientConnection} from './ClientConnection.js';

//remember to change this if running on local
const socketPath = {local:'/socket.io', prod:'/node0/socket.io'};
const connection = new ClientConnection({autoConnect: false, path:socketPath["local"]});

export function login(name, color){
    connection.attemptLogin(name, color);
}

displayLoginScreen();


