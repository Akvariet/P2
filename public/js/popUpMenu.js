import {connection} from "./ClientConnection.js";
import {audioPlayers} from './proxi.js';
import {myStream} from './PeerConnection.js';

let muted = false, deafened = false, isPopUp;
export const userCoordinates = {x: 0, y: 0};
export const cameraCoordinates = {x: 0, y: 0};


function isUserMoving(id){
    const containerElement = document.getElementById(id);

    // if same coordinates as last time it, user moved
    if (containerElement.style.left === userCoordinates.x && containerElement.style.top === userCoordinates.y) {
        return false;
    }
    userCoordinates.x = containerElement.style.left;
    userCoordinates.y = containerElement.style.top;
    return true;
}

function isCameraMoving(){
    const space = document.getElementById("space");

    // if same coordinates as last time, camera moved
    if (space.style.left === cameraCoordinates.x && space.style.top === cameraCoordinates.y){
        return false;
    }
    cameraCoordinates.x = space.style.left;
    cameraCoordinates.y = space.style.top;
    return true;
}

export function usePopUpMenu(id){
    const containerElement = document.getElementById(id);
    const userDisplayElement = containerElement.querySelector(".body-display");
    enableUserState(id);
    userDisplayElement.onclick = (e) => menuPopUp(e, id);
}

function enableUserState(id) {
    const muteBtn = document.getElementById("microphone");
    const spksBtn = document.getElementById("speakers");
    muteBtn.onclick = () => {
        doStateMute(id);
    }
    spksBtn.onclick = () => {
        doStateDeafen(id);
    }
}

function menuPopUp(e, id){
    e.preventDefault();

    const containerElement = document.getElementById(id);
    let userRect = containerElement.getBoundingClientRect();
    const popup = document.getElementById("menuPopUp");

    if (isPopUp){

        // calculates midpoint of container element and uses relative integers to place popupmenu above user
        let userCenter = {x: (userRect.right + userRect.left)/2, y: (userRect.top + userRect.bottom)/2}
        popup.style.left = (userCenter.x - 35) + "px";
        popup.style.top = (userCenter.y - 255) + "px";

        if (!isUserMoving(id) && !isCameraMoving()) {
            popup.style.display = "block";
            isPopUp = false;
        }
    } 
    else{
        popup.style.display = "none";
        isPopUp = true;
    }
}

function doStateMute(id){
    const img = document.getElementById("microphone");
    const SpeakerImage = document.getElementById("speakers");

    // changes microphone picture through search path of image and mutes the user upon change of state
    if (muted){
        img.src="./resources/mic-fill.svg";
        SpeakerImage.src = "./resources/volume-up-fill.svg";
        muted = false;
        
        // mutes the user
        toggleMic();

        if(deafened){
            toggleSpeakers();
            deafened = false;
        }

        displayState(id, 'mic', "none");
    }
    else{
        img.src="./resources/mic-mute-fill.svg";
        muted = true;

        // unmutes the user
        toggleMic();
        displayState(id, 'mic', "url(../resources/mic-mute-fill.svg)");
    }
}

function toggleMic() {
    myStream.getTracks().forEach(track => track.enabled = !track.enabled);
}

function doStateDeafen(id){
    const img = document.getElementById("speakers");
    const micImage = document.getElementById("microphone");

    // changes deafen picture through search path of image and deafens user upon change of state
    if (deafened){
        img.src="./resources/volume-up-fill.svg";
        micImage.src="./resources/mic-fill.svg"
        deafened = false;
        
        // undeafens the user and therefore unmutes all other users
        toggleSpeakers();

        if(muted){
            toggleMic();
            muted = false;
        }

        displayState(id, 'speaker', "none");
    }
    else{
        img.src="./resources/volume-mute-fill.svg";
        micImage.src="./resources/mic-mute-fill.svg"
        deafened = true;
        
        // deafens the user such that every other user is muted
        toggleSpeakers();

        if(!muted){ 
            toggleMic();
            muted = true;
        }

        displayState(id, 'speaker', "url(../resources/volume-mute-fill.svg)");
    }
}

function toggleSpeakers(){
    for (const audioPlayer in audioPlayers){
        audioPlayers[audioPlayer].audio.muted = deafened;
    }
}

function displayState(id, elm, backgroundIMG){
    const containerElement = document.getElementById(id);
    const userDisplayElement = containerElement.querySelector(".body-display");

    userDisplayElement.style.backgroundImage = backgroundIMG;
    connection.emit('sound-controls', elm, deafened, id);
}