import {audioPlayers} from './proxi.js';

let muted, isPopUp;
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

export function menuPopUp(e, id){
  e.preventDefault();

  const containerElement = document.getElementById(id);
  let userRect = containerElement.getBoundingClientRect();
  const popup = document.getElementById("menuPopUp");

  if (isPopUp){

    // calculates midpoint of container element and uses relative integers to place popupmenu above user
    let userCenter = {x: (userRect.right + userRect.left)/2, y: (userRect.top + userRect.bottom)/2}
    popup.style.left = (userCenter.x - 35) + "px";
    popup.style.top = (userCenter.y - 180) + "px";

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

export function changeMuteStateUser(){
    let img = document.getElementById("speakers");

    // changes mute picture through search path of image and mutes user upon change of state
    if (muted){
      img.src="./resources/speakerIcon.svg";
      muted = false;

      for (const audioPlayer in audioPlayers) {
        audioPlayers[audioPlayer].audio.muted = false;
      }
    }
    else{
      img.src="./resources/speakerIconMuted.svg";
      muted = true;

      for (const audioPlayer in audioPlayers) {
        audioPlayers[audioPlayer].audio.muted = true;
      }
    }
}
