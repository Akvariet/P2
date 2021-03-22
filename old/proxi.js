
// Returns an object of distances between position and the elements in positions.
// The object is indexed by the user ids.
export function distance(position, positions){
    const temp = {};

    Object.keys(positions).forEach(id => {
       temp[id] = dist(relativePos(position, positions[id]));
    });

    return temp;

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
}

// Contains all of the functions that control how voice volume change according to distance.
export class VolumeFunctions {
    constructor(slope, minVolume) {
        this.slope = slope || 0.075;
        this.minVolume = minVolume || 20;
        this.maxVolume = 100;
    }
    //Volume functions
    volume = volume => volume > this.minVolume ? volume : this.minVolume;

    linearDecrease = distance => this.volume(-this.slope * distance + this.maxVolume);
}

// Recalculate the volume of all users.
// Useful when this client moves and the relative positions of everyone has changed.
export function calculateVolume(myPosition, userCollection, volumeFunc){
    const dist = distance(myPosition, userCollection.positions());

    Object.keys(dist).forEach(key => (userCollection.get(key)).volume = volumeFunc(dist[key]));
}



