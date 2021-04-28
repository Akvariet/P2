export const audioPlayers = {};

/**
 * Calculates the distance from myPosition to position.
 * @param {object} myPosition
 * @param {object} position
 * */
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


/**
 * @summary If myUser moves, the distance to all other users is recalculated.
 * @param {HTMLElement} myUser
 * */
export function beginProxiChat(myUser){
    myUser.addEventListener('moved', (e)=>{

        for (const audioPlayer in audioPlayers) {
            adjustVolume(audioPlayers[audioPlayer].audio, e.detail, audioPlayers[audioPlayer].position);
        }
    });
}


/**
 * @summary Initiates proximity chat between myUser and otherUser. If the other user moves, the distance is calculated.
 * @param {HTMLAudioElement} audio - The audio element from which to play the audio.
 * @param {HTMLElement} myUser
 * @param {HTMLElement} otherUser
 * */
export function proxiChat(audio, myUser, otherUser){
    const userID = otherUser.getAttribute('id');
    otherUser.append(audio);
    audioPlayers[userID] = {audio: audio, position: {top: otherUser.offsetTop, left: otherUser.offsetLeft}};

    otherUser.addEventListener('moved', () => {
        const pos1 = {top: myUser.offsetTop, left: myUser.offsetLeft};
        const pos2 = {top: otherUser.offsetTop, left: otherUser.offsetLeft};

        audioPlayers[userID].position = pos2;

        adjustVolume(audio, pos1, pos2);
    })
}

const volFunc = new VolumeFunctions();

function adjustVolume(audio, myPosition, position){
    const d = distance(myPosition, position);
    audio.volume = volFunc.linearDecrease(d);
}

