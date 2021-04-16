import {UserProperties} from "./user.js";
import * as socket_io from "socket.io";
import {ConnectionTable} from "./connection.js";
import {Spinner} from './backend-spinner.js';
import {ColorPicker} from "./ColorPicker.js";

// AkvarioServer controls all real time connection with users all users.
export class AkvarioServer{
    io;
    userProperties = new UserProperties();
    connections = new ConnectionTable();
    colorPicker = new ColorPicker();
    allowReq = true;
    spinner = new Spinner();

    constructor(HTTPServer){
        this.io = new socket_io.Server(HTTPServer);
        this.io.on('connection', (socket) =>{
            socket.on('login-attempt', (name, color) =>{
                if(name && color && name.length <= 12 && name.length >= 2)
                    this.requestLogin(socket, name, color);
                else
                    this.rejectLogin(socket, 'Error in input');
            });
        });
    }

    connectionSetup(socket){
        socket.on('disconnect', (reason) => this.disconnect(socket, reason));
        socket.on('moved', position => this.moveUser(socket, position));
        socket.on('turned', rotation => this.rotateUser(socket, rotation));
        socket.on('cameramove', allowed => this.cameramoveUser(socket, allowed));
        socket.on('start-spinner', id => this.startSpinner(id));
        socket.on('user-speaking', (speaking, id) => socket.broadcast.emit('user-speaking', speaking, id));
    }

    requestLogin(socket, name, color) {
        // Validate name and color
        color = this.colorPicker.getShade(color);
        // If validation is successful, login.
        this.login(socket, name, color);

        // Else, tell the user to try again.
    }

    rejectLogin(socket, reason){
        socket.emit('login-rejected', reason);
    }

    login(socket, name, color) {
        //Setup connection.
        this.connectionSetup(socket);

        try{
            // Create the user.
            const user = this.userProperties.create(name, color);
            // Save connection.
            this.connections.newConnection(socket.id, user.id);

            // Reply to the user.
            socket.emit('login-successful', user.id, this.userProperties.allUsers());

            // Broadcast to other users.
            this.broadcast(socket, 'new-user-connected', user);
        } catch(err){
            console.error(err);
            this.rejectLogin(socket, err);
        }
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

    startSpinner(id) {

        // gets the users relative position to the spinner
        const relPos = this.spinner.getRelUserPos((this.userProperties.positions), this.spinner.pos);

        // finds the user who clicked on the spinner
        const userPos = relPos[id];

        // calculates the distance from the user to the spinner
        const dist = Math.sqrt(Math.pow(userPos.top, 2) + Math.pow(userPos.left, 2));

        if (dist <= this.spinner.range) {
            if (this.allowReq) { // if no one already has requested
                this.allowReq = false;

                //start a new game in the backend which gives the spinner new properties
                this.spinner.newGame(this.userProperties);

                // sends back the rotation of the spinner and the result of the game
                this.io.emit('spinner-result', this.userProperties.colors, this.spinner);

                setTimeout(() => this.allowReq = true, this.spinner.waitTime.total);
            }
        }
    }

    cameramoveUser(socket, allowed){
        socket.emit('updatecameramove', allowed);
    }
}

