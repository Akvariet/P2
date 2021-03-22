import {UserProperties} from "./user.js";
import * as socket_io from "socket.io";
import {ConnectionTable} from "./connection.js";

export class AkvarioServer{
    io;
    userProperties = new UserProperties();
    connections = new ConnectionTable()

    constructor(HTTPServer){
       this.io = new socket_io.Server(HTTPServer);
       this.io.on('connection', socket => this.connectionSetup(socket))
    }

    connectionSetup(socket){
        socket.on('login', (name, color) => this.requestLogin(socket, name, color));
        socket.on('changed-position', position => this.moveUser(socket, position));
        socket.on('changed-rotation', rotation => this.rotateUser(socket, rotation))
    }

    requestLogin(socket, name, color) {
        // Validate name and color

        // Create the user.
        const user = this.userProperties.create(name, color);

        // Save connection.
        this.connections.newConnection(socket.id, user.id);

        // Reply to the user.
        socket.emit('user', user);

        // Broadcast to other users.
        this.broadcastNewUser(user);
    }

    broadcastNewUser(socket, user) {
        socket.broadcast.emit('new-user', user);
    }

    editUserProperty(socketID, property, value) {
        // Find the users id.
        const gameID = this.id(socketID);

        // Change the property.
        const user = this.userProperties.users[gameID];
        user[property] = value;

        // Return change message to caller.
        const msg = {};
        msg[gameID] = value;
        return msg;
    }

    moveUser(socket, position){
        const msg = this.editUserProperty(socket.id, 'position', position);
        socket.broadcast.emit('user-moved', msg);
    }

    rotateUser(socket, rotation) {
        const msg = this.editUserProperty(socket.id, 'rotation', rotation);
        socket.broadcast.emit('user-turned', msg);
    }

    id(socketID){
        return this.connections.gameID(socketID);
    }
}

