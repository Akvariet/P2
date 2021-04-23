import {users} from './main.js';

export const audioPlayers = {};
let myID;

export function distance(myPosition, position){
    const left = position.left - myPosition.left
    const top  = position.top  - myPosition.top

    // Return the distance between myPosition and position.
    return Math.sqrt((left * left) + (top * top));
}

// Contains all of the functions that control how voice volume change according to distance.
export class VolumeFunctions {
    constructor(slope, minVolume) {
        this.slope = slope || 0.0008;
        this.minVolume = minVolume || 0.02;
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

export function beginProxiChat(id){
    myID = id;
    const myElement = users[myID];
    myElement.addEventListener('moved', (e)=>{

        for (const audioPlayer in audioPlayers) {
            adjustVolume(audioPlayers[audioPlayer].audio, e.detail, audioPlayers[audioPlayer].position);
        }
    });
}

export function proxiChat(audio, userID){
    const userContainer = users[userID];
    const myElement = users[myID];
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

function adjustVolume(audio, myPosition, position){
    const d = distance(myPosition, position);
    audio.volume = volFunc.linearDecrease(d);
}

function getPos(HTMLElement){
    return {
        top:  Number(HTMLElement.style.top.slice(0, -2)),
        left: Number(HTMLElement.style.left.slice(0, -2))
    };
}