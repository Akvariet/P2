import {colors, get, positions} from '../users.js';
import {emit} from './AkvarioServer.js'

export class Spinner {
    // The smoothness of the spinners rotation
    refine = 20;
    // The difference in degrees between the rotationAngle and the spinners start position
    repositioningAngle = 0;
    // The amount of ms the spinner will be still before repositioning
    stillTime = 500;
    // The game area radius
    range = 250;
    // The spinners position in the space
    pos = {top : 750, left: 1000};
    // Velocities are the angular velocity on the spinner in [rad/s]
    velocity = {
        // The maximum velocity
        max : 0,
        // The lowest velocity
        min : 0,
        // The different velocities in the different spin sessions
        sessions : [],
        // The velocity when the spinner is repositioning
        repositioning : 0
    };
    waitTime = {
        // The waitTimes on the spinSessions
        sessions : [],
        // The waitTime from spinning start until repositioning begins
        repositioning : 0,
        // The waitTime before the spinners matrix will be reset
        reset : 0,
        // The total time from game start to game end.
        total : 0
    };
    result = {rotationAngle : 0, winner : 0, userAngles : []};

    // Starts a new spinner game
    newGame() {
        // Finds the rotationAngle, id on the winner and the users angles to the spinner.
        this.result = spin(positions(), this.pos, this.range);
        this.rotationAngle = this.result.rotationAngle;
        delete this.result.rotationAngle;

        //Finds the rotationTime for this game
        this.rotationTime = calcRotationTime(this.rotationAngle);

        // Finds the repositioningAngle for this game
        this.repositioningAngle = (360 - (this.rotationAngle % 360));

        // Finds the different velocities for the spinner game
        this.velocity = calcVelocity(this.rotationAngle, this.rotationTime, this.refine);

        // Finds the different waitTimes for the spinner game
        this.waitTime = calcWaitTimes(this.velocity, this.refine, this.rotationAngle, this.stillTime);
    }
}

const spinner = new Spinner();

// Simulates a spin game
export function spin(userPos, spinnerPos, range, rot){
    const minRounds = 2;
    const userAngles = {};

    // gets the users relative position to the spinner
    const relPos = getRelUserPos(userPos, spinnerPos);

    // finds the players who inside the game area, and gets relative position from relPos
    const players = findPlayers(relPos, range);

    if (rot === undefined) {
        rot = (360 * minRounds) + (Math.random() * 360 * 3); // spinner rotates min 2 and max 5 rounds
    }

    const result = closestUser(players, rot, userAngles);

    //return the result of the spin and the rotation of the spinner. Players should not move before the game is done.
    return {winner: result, rotationAngle: Number(rot.toFixed(4)), userAngles: userAngles};
}

//Find the user which is closest to being pointed at
function closestUser(players, rotDeg, userAngles){
    const rots = [];
    const ids  = Object.keys(players);
    //Check the angles between all the users in the game.
    ids.forEach(id => {
        let a = Math.atan(players[id].top / players[id].left) * 180 / Math.PI;

        // if user is in second or third quadrant
        if (players[id].left < 0)
            a = 180 + a;

        // if user is in first quadrant
        if (players[id].left > 0 && players[id].top < 0)
            a = 360 + a;

        //calculates the degrees the user has to the rotated spinner
        let angFromRot = Math.abs(a - (rotDeg % 360))

        if (angFromRot > 180)
            angFromRot = 360 - angFromRot;

        //adds the difference in degrees to rots.
        rots.push(Number(angFromRot.toFixed(4)));

        //takes the angles to
        userAngles[id] = Number(a.toFixed(4));
    });

    //Return the index of the lowest angle.
    return ids[rots.indexOf(Math.min(...rots))];
}

//Returns the position of the players in relation to the spinner.
export function getRelUserPos(userPos, s_pos) {
    const relativeAngles = {};

    Object.keys(userPos).forEach(id => relativeAngles[id] = {
        top:  userPos[id].top  - s_pos.top + 57.5,
        left: userPos[id].left - s_pos.left + 106.5
    });

    return relativeAngles;
}

function findPlayers(relPos, range) {
    const players = {};

    // finds the users that are inside the 'game range'
    for (const user in relPos) {
        const dist = Math.sqrt(Math.pow(relPos[user].top, 2) + Math.pow(relPos[user].left, 2));
        if (dist <= range)
            players[user] = relPos[user];
    }
    return players;
}

// finds the rotation time on the spinner
function calcRotationTime(rotationAngle) {
    switch (Math.floor(rotationAngle / 360)) {
        case 2: case 3: return 4;
        case 4: case 5: return 5;
        default: return 4;
    }
}

// calculates the different velocities of the spinner
export function calcVelocity(rotationAngle, rotationTime, refine) {
    let vMax = Number(((2 * toRadians(rotationAngle)) / (rotationTime)).toFixed(4));
    let vMin = vMax/refine;
    const deceleration = (0-vMax)/rotationTime;
    let spinSessions = [vMax];

    for (let i = 1; i < refine; i++)
        spinSessions.push(Number((deceleration * (rotationTime * i/refine) + vMax).toFixed(4)));

    return {
        max : Number(vMax.toFixed(4)),
        min : Number(vMin.toFixed(4)),
        repositioning : 3,
        sessions : spinSessions
    }
}

// compute an angle from degrees to radians
function toRadians(angle) {
    return angle * (Math.PI/180);
}

// calculates the different wait times for the setTimeouts in the spinner.
export function calcWaitTimes (velocity, refine, rotationAngle, stillTime) {
    let spinSessions = [0];

    for (let i = 1; i < refine; i++)
        spinSessions.push(Number((spinSessions[i-1] + toRadians(Math.floor(rotationAngle * (1 / refine))) / (velocity.sessions[i-1]/1000)).toFixed(4)));

    let repositioning = Number((stillTime + spinSessions[refine-1] + toRadians(Math.floor(rotationAngle * (1 / refine))) / (velocity.min/1000)).toFixed(4));
    let reset = 2600;

    return {sessions : spinSessions, repositioning : repositioning, reset : reset, total : repositioning + reset};
}

let allowReq = true;

export function startSpinner(socket) {
    // gets the users relative position to the spinner
    const relPos = getRelUserPos(positions(), spinner.pos);

    // finds the user who clicked on the spinner
    const userPos = relPos[get(socket.id).gameID];

    // calculates the distance from the user to the spinner
    const dist = Math.sqrt(Math.pow(userPos.top, 2) + Math.pow(userPos.left, 2));

    if (dist <= spinner.range) {
        if (allowReq) { // if no one already has requested
            allowReq = false;

            //start a new game in the backend which gives the spinner new properties
            spinner.newGame();

            // sends back the rotation of the spinner and the result of the game
            emit('start-spinner', colors(), spinner);

            setTimeout(() => allowReq = true, spinner.waitTime.total);
        }
    }
}