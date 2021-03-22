import {UserProperties} from "./user.js";

export function handleConnection(socket, userData){
    socket.emit('connected')

    socket.on('hello', () => console.log('world'));
}

