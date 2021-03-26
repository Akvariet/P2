import {moveUser, removeDeadUser, turnUser} from './interaction.js';
import {drawUser} from './login.js';
import {enterRoom} from './client.js';
import {handlePeerConnections} from './voice.js';

export class ClientConnection{
    socket = io({autoConnect:false});
    myID;

    constructor() {
        this.establishConnection();
        this.handleServerEvents();
    }

    establishConnection(){
        // Open the websocket.
        this.socket.open();
    }

    emit(event, ...args){
        this.socket.emit(event, ...args);
    }

    handleServerEvents() {
        // The login attempt was accepted/rejected by the server.
        this.socket.on('login-successful', (myId, users) => this.login(myId, users));
        this.socket.on('login-rejected',   this.loginRejected);

        // A new user has connected.
        this.socket.on('new-user-connected', user => this.newConnection(user));

        // If a user disconnected.
        this.socket.on('user-disconnected', id => removeDeadUser(id));

        // If a user moves or turns.
        this.socket.on('moved', (id, position) => this.move(id, position));
        this.socket.on('turned', (id, position) => this.turn(id, position));

        // If the client is disconnected. (If I am disconnected.)
        this.socket.on('disconnect', reason => this.disconnect(reason));
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
        handlePeerConnections(myId, users);
        // Enter the room.
        const avatar = enterRoom(myId, users);

        // Make my own user interactable.
        this.handleClientEvents(myId, avatar);
    }

    newConnection(user){
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
}