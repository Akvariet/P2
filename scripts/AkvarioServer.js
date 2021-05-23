import * as socket_io from "socket.io";
import * as user from '../users.js';
import {startSpinner} from './backendSpinner.js';

let io;
/**
 * AkvarioServer controls all real time connection with users all users.
 * AkvarioServer sets up a socket server and handles emits sent by clients.
 * @param {any} HTTPServer - The http server.
 * @param {boolean} testMode
 * */
export function AkvarioServer(HTTPServer, testMode){
    io = new socket_io.Server(HTTPServer);
    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token
        if (user.get(token)){
            user.changeID(socket.id, token);

            socket.broadcast.emit('new-user-connected', user.get(socket.id));
            socket.on('test', () => console.log('test'));
            socket.on('moved',  position => move(socket, position));
            socket.on('turned', rotation => turn(socket, rotation));
            socket.on('disconnect',   () => disconnect(socket));
            socket.on('user-speaking',  speaking => speak(socket, speaking));
            socket.on('start-spinner',  () => startSpinner(socket));
            socket.on('sound-controls', (state, id) => soundControls(socket, state, id));
            if(testMode) socket.on('stop', () => HTTPServer.close())

        }
        else socket.disconnect();
    });
}

function disconnect(socket){
    console.log(socket.id + ' disconnected.')
    socket.broadcast.emit('user-disconnected', user.get(socket.id).gameID);
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

function speak(socket, speaking){
    socket.broadcast.emit('user-speaking', speaking, user.get(socket.id).gameID);
}

function soundControls(socket, state, id){
    socket.broadcast.emit('sound-controls', state, id);
}

export function emit(event, ...args){
    io.emit(event, ...args);
}
