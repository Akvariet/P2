
//Starts the game when a user clicks on the spinner
export function spinBottle(rotationAngle, winner) {
    let rotationTime = 5;
    let timeBeforeReset = 2;

    const spinner = document.querySelector('#spinner_body');
    //Sets the time the spinner takes to rotate
    spinner.style.transition = 'all ' + rotationTime + 's ease-in-out';

    //rotates the spinner
    spinner.style.transform = 'rotate('+ rotationAngle +'deg)';

    //When the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout((winner) => console.log("The winner is " + winner), (timeBeforeReset*1000)+(rotationTime*1000), winner)
    setTimeout(resetBottlePos, (rotationTime*1000)+(timeBeforeReset*1000), rotationAngle, rotationTime);
}

//Rotates the spinner to its original position.
function resetBottlePos(rotationAngle, rotationTime) {
    let resetPos = (360 - (rotationAngle % 360)) + rotationAngle;
    document.querySelector('#spinner_body').style.transform = 'rotate(' + resetPos + 'deg)';
    setTimeout(resetRotation, (rotationTime*1000));
}

/*Resets the spinner's rotation in css without the user seeing it
* so the rotation value isn't just incremented every game.
* It starts with setting the rotation time to 0, and resets the rotation on the spinner.
* */
function resetRotation() {
    const spinner = document.querySelector('#spinner_body');
    spinner.style.transition = 'all 0s ease-in-out';
    spinner.style.transform = 'rotate(0deg)';
}
