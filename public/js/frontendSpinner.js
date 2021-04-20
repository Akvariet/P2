import {connection} from "./ClientConnection.js";

// spinner element and the spinners style
const spinner = document.querySelector('.spinner');
const spinnerElement = document.getElementById('spinner');
const spinnerRot = getComputedStyle(spinner);

// when someone clicks the spinner
spinnerElement.addEventListener('click', () => {
    if (spinnerRot.transform === 'matrix(1, 0, 0, 1, 0, 0)') { // is the spinner in the starting position?
        connection.emit('start-spinner', connection.myID);
    }
});

// starts the game when a user clicks on the spinner
export function spinBottle(userColors, spinner) {
    let currentAngle = {value : 0};
    const userAngles = spinner.result.userAngles;
    const rotationAngle = spinner.rotationAngle;
    const refine = spinner.refine;
    Object.freeze(userColors);

    // rotates the spinner
    for (let i = 1; i <= refine; i++){
        setTimeout(spinSession, spinner.waitTime.sessions[i-1], spinner.velocity.sessions[i-1], i * (1 / refine));
    }

    /* simulates a spinning session, where the spinner rotates 1/refine part of the full rotationAngle
    at a given velocity v */
    function spinSession(v, part){
        let timer = 0;
        while(currentAngle.value < Math.floor(rotationAngle * part)) {
            currentAngle.value++;

            // Calls a function that rotates the spinner and hightlights the closest user.
            setTimeout((angle, userAngles, userColors) => {
                rotate(angle);
                highlightUser(angle, userAngles, userColors);
            }, (v*timer), currentAngle.value, userAngles, userColors);
            timer++;
        }
    }

    // When the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout(announceWinner, spinner.waitTime.repositioning, spinner.winner, userColors);
    setTimeout(repositionSpinner, spinner.waitTime.repositioning, currentAngle, userAngles, spinner);
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
    const highlightColor = 'black';

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
        const nonSelectedUserColor = userColors[ids[i-1]];

        // if a user has left akvario during the spinner game
        if (nonSelectedUser === null) continue;

        // if the users color is different from his original color, change it
        if (nonSelectedUser.style.backgroundColor !== nonSelectedUserColor || nonSelectedUser.style.fill !== nonSelectedUserColor)
            setColor(nonSelectedUser, nonSelectedUserColor);
    }
}

// changes the color of the user element
function setColor(element, color) {
    if (element !== null) {
        element.style.backgroundColor = color;
        element.style.fill = color;
    }
}

// rotates the spinner to its original position.
function repositionSpinner(currentAngle, userAngles, spinner) {
    let timer = 0;
    while (currentAngle.value < (spinner.rotationAngle + spinner.repositioningAngle)) {
        currentAngle.value++
        setTimeout(rotate, (spinner.velocity.repositioning * timer), currentAngle.value);
        timer++;
    }

    // resets the matrix of the spinner when the winner announcement is done
    setTimeout(resetSpinnerAndUsersColor,spinner.waitTime.reset, userAngles);
}

// resets the spinner matrix and the users colors if something happend
function resetSpinnerAndUsersColor(userColors){

    //checking if someone still has the selected or winner color
    for(const user in userColors) {
        const userElement = document.getElementById(user + '_body');
        const userColor = userColors[user];

        if (userElement === null) continue;

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

    flash(winnerElement, winnerColor, originalColor, 200);
}

// Make the user flash in winnerColor and originalColor
function flash(winnerElement, winnerColor, originalColor, time){
    blink(winnerElement, winnerColor, time);
    setTimeout(blink, 100, winnerElement, originalColor, time);
}

// sets the color of the user at a given interval for 2,5 seconds
function blink(element, color, time) {
    let switchColor = setInterval(setColor, time, element, color);
    setTimeout(() => clearInterval(switchColor), 2500);
}


