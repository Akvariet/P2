const spinner = document.querySelector('.spinner');

//Starts the game when a user clicks on the spinner
export function spinBottle(rotationAngle, winner) {
    let rotationTime;
    let timeBeforeReset = 0.5;

    // Sets the rotation time depending on how many rounds the spinner spins
    switch (Math.floor(rotationAngle / 360)) {
        case 0: rotationTime = 2; break;
        case 1: rotationTime = 3; break;
        case 2: case 3: rotationTime = 4; break;
        case 4: case 5: rotationTime = 5; break;
        default: rotationTime = 1; break;
    }

    //Sets the time the spinner takes to rotate
    spinner.style.transition = 'all ' + rotationTime + 's ease-in-out';

    //rotates the spinner
    spinner.style.transform = 'rotate('+ rotationAngle +'deg)';

    //When the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout((winner) => console.log("The winner is " + winner), (timeBeforeReset*1000)+(rotationTime*1000), winner)
    setTimeout(resetBottlePos, (rotationTime*1000)+(timeBeforeReset*1000), rotationAngle);
}

//Rotates the spinner to its original position.
function resetBottlePos(rotationAngle) {
    let resetPos = (360 - (rotationAngle % 360)) + rotationAngle;
    spinner.style.transition = 'all 2s ease-in-out';
    spinner.style.transform = 'rotate(' + resetPos + 'deg)';
    setTimeout(resetRotation, 2000);
}

/*Resets the spinner's rotation in css without the user seeing it
* so the rotation value isn't just incremented every game.
* It starts with setting the rotation time to 0, and resets the rotation on the spinner.
* */
function resetRotation() {
    spinner.style.transition = 'all 0s ease-in-out';
    spinner.style.transform = 'rotate(0deg)';
}
