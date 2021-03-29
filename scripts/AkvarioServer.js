import {UserProperties} from "./user.js";
import * as socket_io from "socket.io";
import { PeerServer } from 'peer';
import {ConnectionTable} from "./connection.js";
import {ColorPicker} from "../public/js/ColorPicker.js";


// AkvarioServer controls all real time connection with users all users.
export class AkvarioServer{
    io;
    peerServer;
    userProperties = new UserProperties();
    connections = new ConnectionTable();
    colorPicker = new ColorPicker();

    constructor(HTTPServer, options){
        this.io = new socket_io.Server(HTTPServer);
        this.io.on('connection', socket =>
            socket.on('login-attempt', (name, color) =>
                this.requestLogin(socket, name, color)));
        this.peerServer = PeerServer(options);
    }

    connectionSetup(socket){
        this.peerServer.on('connection', client => this.peerConnect(client, false));
        this.peerServer.on('disconnect', client => this.peerDisconnect(client, false));
        socket.on('disconnect', (reason) => this.disconnect(socket, reason));
        socket.on('moved', position => this.moveUser(socket, position));
        socket.on('turned', rotation => this.rotateUser(socket, rotation));
    }

    requestLogin(socket, name, color) {
        // Validate name and color
        color = this.colorPicker.getShade(color);
        // If validation is successful, login.
        this.login(socket, name, color);

        // Else, tell the user to try again.
    }

    login(socket, name, color) {
        //Setup connection.
        this.connectionSetup(socket);

        // Create the user.
        const user = this.userProperties.create(name, color);

        // Save connection.
        this.connections.newConnection(socket.id, user.id);

        // Reply to the user.
        socket.emit('login-successful', user.id, this.userProperties.allUsers());

        // Broadcast to other users.
        this.broadcast(socket, 'new-user-connected', user);
    }

    // Broadcast message to all other users than the sender.
    broadcast(socket, event, ...args){
        socket.broadcast.emit(event, ...args);
    }

    editUserProperty(socketID, property, value) {
        // Find the users id.
        const gameID = this.id(socketID);

        // Change the property.
        const user = this.userProperties.users[gameID];
        user.setProperty(property, value);
    }

    moveUser(socket, position){
        this.editUserProperty(socket.id, 'position', position);
        socket.broadcast.emit('moved', this.id(socket.id), position);
    }

    rotateUser(socket, rotation) {
        this.editUserProperty(socket.id, 'rotation', rotation);
        socket.broadcast.emit('turned', this.id(socket.id), rotation);
    }

    id(socketID){
        return this.connections.gameID(socketID);
    }

    disconnect(socket, reason) {
        const id = this.id(socket.id);
        console.log(`User ${id} has disconnected: ${reason}`);
        socket.broadcast.emit('user-disconnected', id);
        this.userProperties.remove(id);
    }

    peerConnect(client, enabled){
        if(enabled) console.log(`PeerJS Server: ${client.id} Connected!`);
    }

    peerDisconnect(client, enabled){
        if(enabled) console.log(`PeerJS Server: ${client.id} Disconnected!`)
    }
}

