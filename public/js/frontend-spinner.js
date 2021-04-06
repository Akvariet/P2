const spinner = document.querySelector('.spinner');

// starts the game when a user clicks on the spinner
export function spinBottle(rotationAngle, winner, userAngles) {
    let rotationTime;
    let timeBeforeReset = 0.5;
    let angle = {value:0};
    let waitTime = 0;
    let refine = 20 // how fluent the rotation animation should be. Higher number more fluent
    let userColors = {};

    // gets the participants original colors before game starts.
    for (const user in userAngles)
        userColors[user] = document.getElementById(user + "_body").style.backgroundColor;

    // sets the rotation time depending on how many rounds the spinner spins
    switch (Math.floor(rotationAngle / 360)) {
        case 2: case 3: rotationTime = 4; break;
        case 4: case 5: rotationTime = 5; break;
        default: rotationTime = 4; break;
    }

    //defines the velocity of the spinner
    const vMax = (2 * toRadians(rotationAngle)) / (rotationTime);
    const vMin = vMax/refine;
    let v = vMin;

    // rotates the spinner
    for (let i = 1; i <= refine; i++) {
        setTimeout(spinSession, waitTime, rotationAngle, angle, v, i * (1 / refine), userAngles, userColors);
        waitTime = waitTime + v * Math.floor(rotationAngle * (1 / refine));
        v += vMin;
    }

    // when the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout(announceWinner, (timeBeforeReset*1000)+(waitTime + v * Math.floor(rotationAngle*(1/refine))), winner, userColors);
    setTimeout(rePosSpinner, (timeBeforeReset*1000)+(waitTime + v * Math.floor(rotationAngle*(1/refine))), rotationAngle, angle, userAngles);
}


// rotates the spinner to its original position.
function rePosSpinner(rotationAngle, angle, userAngles) {
    const vReset = 3;
    const resetPos = (360 - (rotationAngle % 360));
    let timer = 0;

    while (angle.value < rotationAngle + resetPos) {
        angle.value++
        setTimeout(rotate, (vReset*timer), angle.value);
        timer++;
    }

    // resets the matrix of the spinner when the winner announcement is done
    setTimeout(resetSpinnerAndUsers,2600, userAngles);
}

// resets the spinner matrix and the users colors if something happend
function resetSpinnerAndUsers(userColors){

    //checking if someone still has the selected or winner color
    for(const user in userColors) {
        const userElement = document.getElementById(user + '_body');
        const userColor = userColors[user];

        // if the users color is different from his original color, change it
        if (userElement.style.backgroundColor !== userColor || userElement.style.fill !== userColor)
            setColor(userElement, userColor);
    }

    // resets the spinners matrix
    spinner.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
}

// announces the winner
function announceWinner(winner, userColors) {
    const originalColor = userColors[winner.id];
    const winnerColor = 'hsl(116, 100%, 60%)';
    const winnerElement = document.getElementById(winner.id + "_body");

    blink(winnerElement, winnerColor, 200);
    setTimeout(blink, 100, winnerElement, originalColor, 200);
}

// sets the color of the user at a given interval for 2,5 seconds
function blink(element, color, time) {
    let switchColor = setInterval(setColor, time, element, color);
    setTimeout(() => clearInterval(switchColor), 2500);
}

// changes the color of the user element
function setColor(element, color) {
    element.style.backgroundColor = color;
    element.style.fill = color;
}

/* simulates a spinning session, where the spinner rotates 1/refine part of the full rotationAngle
 at a given velocity v */
function spinSession(rotationAngle, angle, v, part, userAngles, userColors){
    let timer = 0;
    while(angle.value < Math.floor(rotationAngle * part)) {
        angle.value++;
        setTimeout(rotate, (v*timer), angle.value); // rotates the spinner
        setTimeout(highlightUser, (v*timer), angle.value, userAngles, userColors); //highlights the closest user
        timer++;
    }
}

// rotates the spinner according to the angle by changing its matrix
function rotate(angle) {
    spinner.style.transform = 'matrix(' + Math.cos(toRadians(angle)) + ','
                                        + Math.sin(toRadians(angle)) + ','
                                        + -Math.sin(toRadians(angle)) + ','
                                        + Math.cos(toRadians(angle)) + ', 0, 0)';
}

// compute an angle from degrees to radians
function toRadians(angle) {
    return angle * (Math.PI/180);
}

// highlights the user that the spinner points at
function highlightUser(angle, userAngles, userColors){
    let angles = [];
    let ids = [];
    const highlightColor = 'hsl(0, 0%, 0%)';

    // finds the angles between the users and the spinners current rotation
    for (const user in userAngles) {
        let angFromRot = Math.abs(userAngles[user] - (angle % 360));
        if (angFromRot > 180)
            angFromRot = 360 - angFromRot;
        angles.push(angFromRot);
        ids.push(user);
    }

    // finds the closest user to the spinner
    const closestUserIndex = angles.indexOf(Math.min(...angles));
    const closestUser = ids[closestUserIndex];
    const userElement = document.getElementById(closestUser + "_body");

    // sets the color on the selected user to the highlight color
    setColor(userElement, highlightColor);

    // makes sure  that all the other users are their original color
    for (let i = 1; i <= ids.length; i++) {
        if (ids[i-1] === closestUser) continue; // if we meet the selected user, go to next user

        const nonSelectedUser = document.getElementById(ids[i-1] + "_body");
        const nonSelectedUserColor = userColors[i];

        // if the users color is different from his original color, change it
        if (nonSelectedUser.style.backgroundColor !== nonSelectedUserColor || nonSelectedUser.style.fill !== nonSelectedUserColor)
            setColor(nonSelectedUser, nonSelectedUserColor);
    }
}
