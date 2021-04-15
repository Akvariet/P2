import {audioPlayers} from './proxi.js';
import {myStream} from './voice.js';

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
  const userElement = document.getElementById(id + '_body');
  enableUserState();
  userElement.onclick = (e) => menuPopUp(e, id);
}

function enableUserState() {
  const muteBtn = document.getElementById("microphone");
  const spksBtn = document.getElementById("speakers");
  muteBtn.onclick = () => {
      doStateMute();
  }
  spksBtn.onclick = () => {
      doStateDeafen();
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

function doStateMute(){
    let img = document.getElementById("microphone");

    // changes microphone picture through search path of image and mutes the user upon change of state
    if (muted){
      img.src="./resources/mic-fill.svg";
      muted = false;

      // mutes the user
      toggleMic();
    }
    else{
      img.src="./resources/mic-mute-fill.svg";
      muted = true;

      // unmutes the user
      toggleMic();
    }
}

function toggleMic() {
  myStream.getTracks().forEach(track => track.enabled = !track.enabled);
}

function doStateDeafen(){
  let img = document.getElementById("speakers");

  // changes deafen picture through search path of image and deafens user upon change of state
  if (deafened){
    img.src="./resources/volume-up-fill.svg";
    deafened = false;

    // undeafens the user and therefore unmutes all other users
    toggleSpeakers();
  }
  else{
    img.src="./resources/volume-mute-fill.svg";
    deafened = true;

    // deafens the user such that every other user is muted
    toggleSpeakers();
  }
}

function toggleSpeakers(){
  for (const audioPlayer in audioPlayers){
      audioPlayers[audioPlayer].audio.muted = deafened;
  }
}
