import {connection} from './main.js';

const audioPlayers = {};

function distance(myPosition, position){
    return dist(relativePos(myPosition, position))
}

// Returns distance given a relative position.
function dist(relPos){
    return Math.sqrt((relPos.left * relPos.left) + (relPos.top * relPos.top));
}

// Returns the position of pos2 relative to pos1
function relativePos(pos1, pos2){
    const pos = {};
    pos['top']  = pos2.top  - pos1.top;
    pos['left'] = pos2.left - pos1.left;
    return pos;
}

// Contains all of the functions that control how voice volume change according to distance.
export class VolumeFunctions {
    constructor(slope, minVolume) {
        this.slope = slope || 0.0005;
        this.minVolume = minVolume || 0.05;
        this.maxVolume = 1;
    }
    //Volume functions
    volumeCap(volume){
        if (volume < this.minVolume)
            return this.minVolume;
        else if (volume > this.maxVolume)
            return this.maxVolume
        return volume;
    }

    linearDecrease(distance){
        const volume = -this.slope * distance + this.maxVolume;
        return this.volumeCap(volume);
    }
}

export function beginProxiChat(myID){
    const myElement = document.getElementById(myID);
    myElement.addEventListener('moved', (e)=>{

        for (const audioPlayer in audioPlayers) {
            adjustVolume(audioPlayers[audioPlayer].audio, e.detail, audioPlayers[audioPlayer].position);
        }
    });
}

export function proxiChat(audio, userID){

    const userContainer = document.getElementById(userID);
    const myElement = document.getElementById(connection.myID);
    userContainer.append(audio);
    audioPlayers[userID] = {audio: audio, position: getPos(userContainer)};

    userContainer.addEventListener('moved', () => {
        const pos1 = getPos(myElement);
        const pos2 = getPos(userContainer);

        audioPlayers[userID].position = pos2;

        adjustVolume(audio, pos1, pos2);
    })
}

const volFunc = new VolumeFunctions();

export function adjustVolume(audio, myPosition, position){
    const d = distance(myPosition, position);
    audio.volume = volFunc.linearDecrease(d);
}

export function getPos(HTMLElement){
    return {top:  Number(HTMLElement.style.top.slice(0, -2)),
        left: Number(HTMLElement.style.left.slice(0, -2)) };
}