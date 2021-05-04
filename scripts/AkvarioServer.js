import * as socket_io from "socket.io";
import * as user from '../users.js';
import {startSpinner} from './backendSpinner.js';

let io;
let counter = 0;
/**
 * AkvarioServer controls all real time connection with users all users.
 * AkvarioServer sets up a socket server and handles emits sent by clients.
 * @param {any} HTTPServer - The http server.
 * */
export function AkvarioServer(HTTPServer){
    io = new socket_io.Server(HTTPServer);
    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token
        if (user.get(token)){
            user.changeID(socket.id, token);

            socket.broadcast.emit('new-user-connected', user.get(socket.id));
            socket.on('disconnect', () => disconnect(socket));
            socket.onAny((event, ...args) => {
                (event => {
                    switch (event) {
                        case 'moved'             : return move;     // A user moved.
                        case 'turned'            : return turn;     // A user turned.
                        case 'user-speaking'     : return speak;
                        case 'sound-controls'    : return soundControls;
                        case 'start-spinner'     : return startSpinner;
                    }
                })(event)(socket, ...args);
            });
            counter++;
            console.log(`Current user count: ${counter}`);
            io.emit('update-user-count', counter)
        }
        else socket.disconnect();
    });
}

function disconnect(socket){
    console.log(socket.id + ' disconnected.')
    socket.broadcast.emit('user-disconnected', user.get(socket.id).gameID);
    user.remove(socket.id);
    counter--;
    socket.broadcast.emit('update-user-count', counter);
    console.log(`Current user count: ${counter}`);
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

function speak(socket, speaking){
    socket.broadcast.emit('user-speaking', speaking, user.get(socket.id).gameID);
}

function soundControls(socket, elm, state, id){
    socket.broadcast.emit('sound-controls', elm, state, id);
}

export function emit(event, ...args){
    io.emit(event, ...args);
}
