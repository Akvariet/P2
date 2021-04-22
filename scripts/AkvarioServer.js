import * as socket_io from "socket.io";
import * as connection from './connection.js'
import * as user from '../users.js';

//
/**
 * AkvarioServer controls all real time connection with users all users.
 * AkvarioServer sets up a socket server and handles emits sent by clients.
 * @param {any} HTTPServer - The http server.
 * */
export function AkvarioServer(HTTPServer){
    this.io = new socket_io.Server(HTTPServer);
    this.io.on('connection', (socket) => {
        const token = socket.handshake.auth.token
        if (user.get(token)){
            user.changeID(socket.id, token);

            socket.broadcast.emit('new-user-connected', user.get(socket.id));

            socket.onAny((event, ...args) => {
                (event => {
                    switch (event) {
                        case 'moved'             : return move;     // A user moved.
                        case 'turned'            : return turn;     // A user turned.
                        case 'disconnect'        : return disconnect;     // You have been disconnected.
                        case 'user-disconnected' : return disconnect; // A user has disconnected.
                    }
                })(event)(socket, ...args);
            });
        }
        else socket.disconnect();
    });
}

function disconnect(socket){
    console.log(socket.id + ' disconnected.')
    socket.broadcast.emit('user-disconnected', id);
    user.remove(socket.id);
}

function move(socket, position){
    const client = user.get(socket.id);
    client.position = position;
    socket.broadcast.emit('moved', client.gameID, position);
}

function turn(socket, rotation){
    const client = user.get(socket.id);
    client.rotation = rotation;
    socket.broadcast.emit('turned', client.gameID, rotation);
}