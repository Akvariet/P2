const spinnerDiv = document.querySelector('.spinner');
const spinner = getComputedStyle(spinnerDiv);

// Starts the game when a user clicks on the spinner
export function spinBottle(rotationAngle, winner, userAngles) {
    let rotationTime;
    let timeBeforeReset = 0.5;
    let timer = {value:0};
    let angle = {value:0}
    let waitTime = [0];
    let refine = 20 // how fluent the rotation animation should be. Higher number more fluent
    let userColors = {};

    for (const user in userAngles) {
        userColors[user] = document.getElementById(user + "_body").style.fill;
    }

    console.log(userColors);

    // Sets the rotation time depending on how many rounds the spinner spins
    switch (Math.floor(rotationAngle / 360)) {
        case 0: rotationTime = 2; break;
        case 1: rotationTime = 3; break;
        case 2: case 3: rotationTime = 4; break;
        case 4: case 5: rotationTime = 5; break;
        default: rotationTime = 1; break;
    }

    const vMax = (2 * toRadians(rotationAngle)) / (rotationTime);
    const vMin = vMax/refine;
    let v = vMin;

    for (let j = 1; j < refine; j++){
        waitTime.push(waitTime[j-1] + (v*j) * Math.floor(rotationAngle*(1/refine))); // past round waittime + velocity at round j * angles rotated at round j
    }

    for (let i = 1; i <= refine; i++) {
        setTimeout(spinSession, waitTime[i-1], rotationAngle, angle, v, i*(1/refine), timer, userAngles, userColors);
        v += vMin;
    }

    // When the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout(announceWinner, (timeBeforeReset*1000)+(waitTime[refine-1] + v * Math.floor(rotationAngle*(1/refine))), winner);
    setTimeout(resetBottlePos, (timeBeforeReset*1000)+(waitTime[refine-1] + v * Math.floor(rotationAngle*(1/refine))), rotationAngle, angle, timer);
}


// Rotates the spinner to its original position.
function resetBottlePos(rotationAngle, angle, timer) {
    const vReset = 3;
    const resetPos = (360 - (rotationAngle % 360));
    timer.value = 0;

    while (angle.value < rotationAngle + resetPos) {
        angle.value++
        setTimeout(rotate, (vReset*timer.value), angle.value);
        timer.value++
    }
    setTimeout(resetRotation,vReset*resetPos);
}

// Resets the spinner's matrix
function resetRotation() {
    spinnerDiv.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
}

// Announces the winner
function announceWinner(winner) {
    const originalColor = winner.color;
    const winnerColor = 'hsl(116, 100%, 60%)';
    const winnerElement = document.getElementById(winner.id + "_body");

    blink(winnerElement, winnerColor, 200);
    setTimeout(blink, 100, winnerElement, originalColor, 200);
}

function blink(element, color, time) {
    let switchColor = setInterval(setColor, time, element, color);

    setTimeout(() => clearInterval(switchColor), 2500);
}


// Changes the color of the user element in a setInterval
function setColor(element, color) {
    element.style.backgroundColor = color;
    element.style.fill = color;
}

function toRadians(angle) {
    return angle * (Math.PI/180);
}

function spinSession(rotationAngle, angle, v, part, timer, userAngles, userColors){
    console.log(userColors);
    timer.value = 0;
    while(angle.value < Math.floor(rotationAngle * part)) {
        angle.value++;
        setTimeout(rotate, (v*timer.value), angle.value);
        setTimeout(highlightUser, (v*timer.value), angle.value, userAngles, userColors, v * (timer.value+1));
        timer.value++;
    }
}

// rotates the spinner according to the angle.
function rotate(angle) {
    spinnerDiv.style.transform = 'matrix(' + Math.cos(toRadians(angle)) + ','
                                  + Math.sin(toRadians(angle)) + ','
                                  + -Math.sin(toRadians(angle)) + ','
                                  + Math.cos(toRadians(angle)) + ', 0, 0)';
}

// higjhlights the user that the spinner points at
function highlightUser(angle, userAngles, userColors, time){
    let angles = [];
    let ids = [];
    const highlightColor = 'hsl(0, 0%, 0%)';

    console.log(userColors);

    for (const user in userAngles) {
        let angFromRot = Math.abs(userAngles[user] - (angle % 360))
        if (angFromRot > 180)
            angFromRot = 360 - angFromRot
        angles.push(angFromRot);
        ids.push(user);
    }

    const closestUser = ids[angles.indexOf(Math.min(...angles))];
    const userElement = document.getElementById(closestUser + "_body");
    const userColor = userColors[closestUser];

    console.log(closestUser);
    console.log(userColor);

    setColor(userElement, highlightColor);
    setTimeout(setColor, time, userElement, userColor);
}
