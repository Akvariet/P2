import {moveUser, removeDeadUser, turnUser} from './interaction.js';
import {callNewPeer, connectToPeerServer} from './voice.js';
import {drawUser} from './login.js';
import {enterRoom} from './client.js';

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
        this.socket.on('login-successful', (myId, users) => this.login(myId, users));
        this.socket.on('login-rejected',   this.loginRejected);
        this.socket.on('new-user-connected', user => this.newConnection(user));
        this.socket.on('user-disconnected', id => removeDeadUser(id));
        this.socket.on('moved', (id, position) => this.move(id, position));
        this.socket.on('turned', (id, position) => this.turn(id, position));
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
        connectToPeerServer(this.socket, myId);
        const avatar = enterRoom(myId, users);
        this.handleClientEvents(myId, avatar);
    }

    newConnection(user){
        callNewPeer(user.id);
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