import {audioPlayers} from './proxi.js';
import {myStream} from './peerConnection.js';
import {updateData} from './connection.js';

let muted = false, deafened = false, isPopUp = false, userMoved = false;

export function usePopUpMenu(myUser){
    const userDisplayElement = myUser.querySelector(".body-display");
    const popup = document.getElementById("menuPopUp");
    const muteBtn = document.getElementById("microphone");
    const spksBtn = document.getElementById("speakers");
    
    userDisplayElement.onclick = (e) => menuPopUp(e, myUser);
    muteBtn.onclick = () => muteUser(myUser);
    spksBtn.onclick = () => doStateDeafen(myUser);

    document.addEventListener('cameramove', () => {
        popup.style.display = "none";
    })
    myUser.addEventListener('moved', () => {
        popup.style.display = "none";
        userMoved = true;
    });
}

function menuPopUp(e, myUser){
  e.preventDefault();

  let userRect = myUser.getBoundingClientRect();
  const popup = document.getElementById("menuPopUp");

  if (!isPopUp){
    // calculates midpoint of container element and uses relative integers to place popupmenu above user
    let userCenter = {x: ((userRect.right + userRect.left)/2) - 35, y: ((userRect.top + userRect.bottom)/2) - 255}
    popup.style.left = userCenter.x + "px";
    popup.style.top = userCenter.y + "px";

    if(userMoved){userMoved = !userMoved} // stops popupmenu to popup when moving user
    else{
        popup.style.display = "block"; 
        isPopUp = true;
    }
  }
  else{
    popup.style.display = "none";
    isPopUp = false;
  }
}

function muteUser(myUser){
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

    changeState(myUser, "unmuted");
  }
  else{
    img.src="./resources/mic-mute-fill.svg";
    muted = true;

    // unmutes the user
    toggleMic();
    changeState(myUser, "muted");
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

    changeState(myUser, "undeafened");
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

    changeState(myUser, "deafened");
  }
}

function toggleSpeakers(){
    for (const audioPlayer in audioPlayers){
      audioPlayers[audioPlayer].audio.muted = deafened;
    }
}

export function displayState(myUser, state){
    const userDisplayElement = myUser.querySelector(".body-display");
    let backgroundIMG;

    switch(state){
        case "muted": backgroundIMG = "url(../resources/mic-mute-fill.svg)"; break;
        case "unmuted": backgroundIMG = "none"; break;
        case "deafened": backgroundIMG = "url(../resources/volume-mute-fill.svg)"; break;
        case "undeafened": backgroundIMG = "none"; break;
    }
    userDisplayElement.style.backgroundImage = backgroundIMG;    
}

function changeState(myUser, state){
    displayState(myUser, state);
    updateData('sound-controls', state, myUser.getAttribute("id"));
}
