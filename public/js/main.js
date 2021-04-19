import {EventEmitter} from 'events';

export const socket = io(options);
export const game = new EventEmitter;
let myID;

export const users = [];

socket.open();

socket.onAny((event, ...args)=> {
    (function(event) {
        switch (event) {
            case 'moved'             : return receiveUserPosition;     // A user moved.
            case 'turned'            : return receiveUserRotation;     // A user turned.
            case 'disconnect'        : return receiveDisconnected;     // You have been disconnected.
            case 'user-speaking'     : return receiveUserSpeaking;     // Someone is speaking.
            case 'spinner-result'    : return receiveGameResult;       // A game result was evaluated by the server.
            case 'user-disconnected' : return receiveUserDisconnected; // A user has disconnected.
            case 'new-user-connected': return receiveNewUser;          // A user has connected.
        }
    }()).call(...args);
});

// Receives a user object from the server and proceeds to draw the user on the page.
function receiveNewUser(user){
    users.push(instantiateUser(user));
}

function receiveUserPosition(id, position){
    move(id, position);
}




// The main game loop. Will be paused if the window is not in focus.
function main(){
    const nextFrame = requestAnimationFrame(main);

    // Update the position and rotation of the users.

    // Update their voice indicators.

    // Send my new position and rotation.


}
