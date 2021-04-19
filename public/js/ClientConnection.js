import {moveUser, removeDeadUser, turnUser} from './interaction.js';
import {drawUser} from './login.js';
import {enterRoom} from './client.js';
import {spinBottle} from "./frontend-spinner.js";
import {PeerVoiceConnection} from './PeerConnection.js';
import {getcameramove} from './cameraMove.js';
import {displayUserSpeak} from "./voiceAnalysis.js";
import {config} from './clientConfig.js';

const socket = io(options);
let myID;




export const clientConnection = {
    constructor(options) {
        socket = io(options)
        this.establishConnection();
    },

    onReceivedUserPosition;
    onReceivedUserRotation;
    onReceivedNewUser;
    onReceivedUserDisconnect;
    onReceivedDisconnect;
    onReceivedGameResult;
    onReceivedUserSpeaking;

    onUserPositionChanged;
    onUserRotationChanged;


    ReceiveSocketEvent(){
        this.socket.onAny((event, ...args)=>{
            (function(event) {
                switch (event) {
                    case 'moved'             : return receiveUserPosition;
                    case 'turned'            : return receiveUserRotation;
                    case 'disconnect'        : return receiveUser;
                    case 'user-speaking'     : return receiveUserPosition;
                    case 'spinner-result'    : return receiveUserPosition;
                    case 'user-disconnected' : return receiveUserPosition;
                    case 'new-user-connected': return receiveUserPosition;
                }
            }()).call(...args);

        })
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
        this.socket.on('new-user-connected', this.onReceivedNewUser);

        // If a user disconnected.
        this.socket.on('user-disconnected', this.onReceivedUserDisconnect);

        // If a user moves or turns.
        this.socket.on('moved', this.onReceivedUserPosition);
        this.socket.on('turned', this.onReceivedUserRotation);

        // If the client is disconnected. (If I am disconnected.)
        this.socket.on('disconnect', this.onReceivedDisconnect);

        // If the client starts the spinner
        this.socket.on('spinner-result', spinBottle);

        // When a person is talking or stops talking
        this.socket.on('user-speaking', displayUserSpeak);
    }

    disconnect(reason){
        console.log('Disconnected: ' + reason);
        window.location.reload(true);
    }

    attemptLogin(name, color){
        this.emit('login-attempt', name, color);
    }

    login(myId, users){
        if(myId && users){
            this.myID = myId;
            // Connect to the peer server and peers for voice chat
            const peerConnection = new PeerVoiceConnection(config('PeerVoiceConnection'), myId, users);

            // Enter the room.
            const avatar = enterRoom(myId, users);

            // Make my own user interactable.
            this.handleClientEvents(myId, avatar);

            this.handleServerEvents();
        } else this.loginRejected(`myId: ${myId}, users: ${users}`);
    }

    loginRejected(reason){
        console.error(reason);
        location.reload
    }

    newConnection(user){
        // Draw the new user on the page.
        drawUser(user);
    }


    handleClientEvents(myId, myAvatar) {
        myAvatar.addEventListener('moved',  e => this.emit('moved', e.detail));
        myAvatar.addEventListener('turned', e => this.emit('turned', e.detail));
        myAvatar.addEventListener('cameramove', e => this.emit('cameramove', e.detail));
        this.socket.on('updatecameramove', allowed => getcameramove(allowed))
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

export const connection = new ClientConnection(config('ClientConnection'));

export function startSpinner() {
    connection.startSpinner();
}

export function login(name, color){
    connection.attemptLogin(name, color);
}


function receiveUserPosition(...args){
    this.onReceivedUserPosition();
    this.onUserPositionChanged();
}

function receiveUserRotation(...args){
    this.onReceivedUserRotation();
    this.onUserRotationChanged();
}

function changeUserRotation(...args){}
function userDisconnected(...args){}
function changeUserPosition(...args){}
function changeUserPosition(...args){}
