import {displayLoginScreen} from "./client.js";
import {ClientConnection} from './ClientConnection.js';
import {options, production} from './clientConfig.js';

const connection = new ClientConnection(options('main', production));

export function login(name, color){
    connection.attemptLogin(name, color);
}

displayLoginScreen();


