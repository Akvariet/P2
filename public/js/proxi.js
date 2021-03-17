
// Returns an array of distances between position and the elements in positions.
export function distance(position, positions){
    const temp = [];

    Object.keys(positions).forEach(u => {
        const e = dist(relativePos(position, positions[u]))
       temp.push(e);
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

function test(){
    const users = {paul: {top:382, left: 28}, ken: {top:328, left: 28}, john: {top:348, left: 278}};
    const user = {top:38, left: 28};

    const dist = distance(user, users);
    dist.forEach(dist => console.log(dist));
    dist.forEach(dist => console.log((new VolumeFunctions).linearDecrease(dist)));

}
test();
