import {audioPlayers} from './proxi.js';
import {myStream} from './peerConnection.js';
import {updateData} from './connection.js';

let muted = false, deafened = false, isPopUp;
export const userCoordinates = {x: 0, y: 0};
export const cameraCoordinates = {x: 0, y: 0};


function isUserMoving(myUser){

  // if same coordinates as last time it, user moved
  if (myUser.style.left === userCoordinates.x && containerElement.style.top === userCoordinates.y) {
    return false;
  }
  userCoordinates.x = myUser.style.left;
  userCoordinates.y = myUser.style.top;
  return true;
}

export function isCameraMoving(){
  const space = document.getElementById("space");

  // if same coordinates as last time, camera moved
  if (space.style.left === cameraCoordinates.x && space.style.top === cameraCoordinates.y){
    return false;
  }
  cameraCoordinates.x = space.style.left;
  cameraCoordinates.y = space.style.top;
  return true;
}

export function usePopUpMenu(myUser){
  const userDisplayElement = myUser.querySelector(".body-display");
  enableUserState(myUser);
  userDisplayElement.onclick = (e) => menuPopUp(e, myUser);
}

function enableUserState(myUser) {
  const muteBtn = document.getElementById("microphone");
  const spksBtn = document.getElementById("speakers");

  muteBtn.onclick = () => doStateMute(myUser);
  spksBtn.onclick = () => doStateDeafen(myUser);
}

function menuPopUp(e, myUser){
  e.preventDefault();

  let userRect = myUser.getBoundingClientRect();
  const popup = document.getElementById("menuPopUp");

  if (isPopUp){

    // calculates midpoint of container element and uses relative integers to place popupmenu above user
    let userCenter = {x: (userRect.right + userRect.left)/2, y: (userRect.top + userRect.bottom)/2}
    popup.style.left = (userCenter.x - 35) + "px";
    popup.style.top = (userCenter.y - 255) + "px";

    if (!isUserMoving(myUser) && !isCameraMoving()) {
      popup.style.display = "block";
      isPopUp = false;
    }
  }
  else{
    popup.style.display = "none";
    isPopUp = true;
  }
}

function doStateMute(myUser){
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

    displayState(myUser, 'mic', muted, "none");
  }
  else{
    img.src="./resources/mic-mute-fill.svg";
    muted = true;

    // unmutes the user
    toggleMic();
    displayState(myUser, 'mic', muted, "url(../resources/mic-mute-fill.svg)");
  }
}

function toggleMic() {
  myStream.getTracks().forEach(track => track.enabled = !track.enabled);
}

function doStateDeafen(myUser){
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

    displayState(id, 'speaker', deafened, "none");
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

    displayState(myUser, 'speaker', deafened, "url(../resources/volume-mute-fill.svg)");
  }
}

function toggleSpeakers(){
    for (const audioPlayer in audioPlayers){
      audioPlayers[audioPlayer].audio.muted = deafened;
    }
}

function displayState(myUser, elm, state, backgroundIMG){
    const userDisplayElement = myUser.querySelector(".body-display");
    userDisplayElement.style.backgroundImage = backgroundIMG;

    updateData('sound-controls', elm, state, id)
}