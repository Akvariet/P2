import {connect} from "./client.js";
const socket = io();


connect();
socket.on('connected', handleSocketConnection());

function handleSocketConnection(){
    console.log('Connected!');
    socket.emit('hello');
    socket.on('hello', arg => console.log(arg));
}

