import {peerConnection, removePeer, peerReady} from './peerConnection.js';
import {displayUserSpeak} from './voiceAnalysis.js';
import {usePopUpMenu, displayState} from './popUpMenu.js';
import {moveCamera, useCameraMove, centerMe} from './cameraMove.js';
import {setupSpinner, spinBottle} from './frontendSpinner.js';
import * as connection from './connection.js';
import {drawUser, enableInteraction, move, turn} from './interaction.js';
import {config} from './clientConfig.js';
const users = {};

// When the game starts, this function runs once for initial setup.
export function main(myID, cid, allUsers){
    connection.connectSocket(io(config('main', cid)));


    // Draw all users that were already connected on the screen.
    for (const user of Object.keys(allUsers))
        users[user] = drawUser(allUsers[user]);

    peerConnection(users[myID], users);
    enableInteraction(users[myID]);
    usePopUpMenu(users[myID]);
    useCameraMove();
    setupSpinner();
    document.addEventListener("keydown", e =>{
        if(e.key === 'c'){
            users[myID].style.top = 0;
            users[myID].style.left = 0;
            centerMe();
        }
    });

    // Receive socket events and call the associated function with args.
    connection.on('moved', receivePosition);
    connection.on('turned', receiveRotation);
    connection.on('disconnect', reloadPage);
    connection.on('start-spinner', spinBottle);
    connection.on('user-speaking', receiveSpeaking);
    connection.on('sound-controls', receiveSoundControls);
    connection.on('user-disconnected', remove);
    connection.on('new-user-connected', receiveNewUser);
    
    update();
}

// The main game loop. Will be paused if the window is not in focus.
function update(){
    requestAnimationFrame(update);
    if(peerReady) moveCamera();
}

// Receives a user object from the server and proceeds to draw the user on the page.
function receiveNewUser(user) {
    users[user.gameID] = drawUser(user);
}

function receivePosition(id, position){
    // Move the user.
    const user = users[id];
    move(user, position);
}

function receiveRotation(id, position){
    // Turn the user.
    const user = users[id];
    turn(user, position);
}

function receiveSpeaking(id, isSpeaking){
    displayUserSpeak(isSpeaking, users[id]);
}

function reloadPage() {
    window.location.reload();
}

/**
 * Removes user with id from the page and from memory and disconnects the peer connection.
 * @param {string} id
 */
function remove(id){
    if (users.hasOwnProperty(id)){
        users[id].remove();
        delete users[id];
    }

    removePeer(id);
}

function receiveSoundControls(id, state){
    displayState(users[id], state);
}