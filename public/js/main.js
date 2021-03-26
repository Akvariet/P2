import {displayLoginScreen} from "./client.js";
import {ClientConnection} from './ClientConnection.js';

const connection = new ClientConnection();

export function login(name, color){
    connection.attemptLogin(name, color);
}

displayLoginScreen();


