import {moveUser, removeDeadUser, turnUser} from './interaction.js';
import {drawUser} from './login.js';
import {enterRoom} from './client.js';
import {spinBottle} from "./frontend-spinner.js";

export class ClientConnection{
    socket = io({autoConnect:false});
    myID;

    constructor() {
        this.establishConnection();
    }

    establishConnection(){
        // Open the websocket.
        this.socket.open();

        // The login attempt was accepted/rejected by the server.
        this.socket.on('login-successful', (myId, users) => this.login(myId, users));
        this.socket.on('login-rejected', this.loginRejected);
    }

    emit(event, ...args){
        this.socket.emit(event, ...args);
    }

    handleServerEvents() {
        // A new user has connected.
        this.socket.on('new-user-connected', user => this.newConnection(user));

        // If a user disconnected.
        this.socket.on('user-disconnected', id => removeDeadUser(id));

        // If a user moves or turns.
        this.socket.on('moved', (id, position) => this.move(id, position));
        this.socket.on('turned', (id, position) => this.turn(id, position));

        // If the client is disconnected. (If I am disconnected.)
        this.socket.on('disconnect', reason => this.disconnect(reason));

        // If the client starts the spinner
        this.socket.on('spinner-result', spinBottle);
    }

    disconnect(reason){
        console.log('Disconnected: ' + reason);
        window.location.reload(true);
    }

    attemptLogin(name, color){
        this.emit('login-attempt', name, color);
    }

    login(myId, users){
        this.myID = myId;
        // Connect to the peer server for voice chat.

        // Enter the room.
        const avatar = enterRoom(myId, users);

        // Make my own user interactable.
        this.handleClientEvents(myId, avatar);

        this.handleServerEvents();
    }

    newConnection(user){
        // Connect to the new peer.

        // Draw the new user on the page.
        drawUser(user);
    }

    handleClientEvents(myId, myAvatar) {
        myAvatar.addEventListener('moved',  e => this.emit('moved', e.detail));
        myAvatar.addEventListener('turned', e => this.emit('turned', e.detail));
    }

    loginRejected(reason){
        // Do something...
    }

    move(id, position){
        moveUser(id, position);
    }

    turn(id, position){
        turnUser(id, position)
    }

    startSpinner(){
        this.emit('start-spinner');
    }
}

const connection = new ClientConnection();

export function startSpinner() {
    connection.startSpinner();
}

export function login(name, color){
    connection.attemptLogin(name, color);
}
