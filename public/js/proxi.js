

function distance(myPosition, position){
    return dist(relativePos(myPosition, position))
}


// Returns an object of distances between position and the elements in positions.
// The object is indexed by the user ids.
export function distances(position, positions){
    const temp = {};

    Object.keys(positions).forEach(id => {
       temp[id] = dist(relativePos(position, positions[id]));
    });

    return temp;

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

// Recalculate the volume of all users.
// Useful when this client moves and the relative positions of everyone has changed.
export function calculateVolume(myPosition, userCollection, volumeFunc){
    const dist = distances(myPosition, userCollection.positions());

    Object.keys(dist).forEach(key => (userCollection.get(key)).volume = volumeFunc(dist[key]));
}

const volFunc = new VolumeFunctions();

export function adjustVolume(audio, myPosition, position){
    const d = distance(myPosition, position);
    const vol = volFunc.linearDecrease(d);
    audio.volume = vol;
}

export function getPos(HTMLElement){
    return {top:  Number(HTMLElement.style.top.slice(0, -2)),
        left: Number(HTMLElement.style.left.slice(0, -2)) };
}