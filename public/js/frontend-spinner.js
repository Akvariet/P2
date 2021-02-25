
//Sends a request to the backend to start the game
function requestGameStart() {
    socket.emit('start game');
}

//When a response from the server is received
socket.on('game', (rotAngle, winner) => {
    spinBottle(rotAngle, winner); //Start the game
});

//Starts the game when a user clicks on the spinner
function spinBottle(rotationAngle, winner) {
    let rotationTime = 5;
    let timeBeforeReset = 2;

    //Sets the time the spinner takes to rotate
    document.querySelector('.arrow').style.transition = 'all ' + rotationTime + 's ease-in-out';

    //rotates the spinner
    document.querySelector('.arrow').style.transform = 'rotate('+ rotationAngle +'deg)';

    //When the spinner stops, announce the winner (in the console atm) and reset the spinner's position
    setTimeout((winner) => console.log("The winner is number " + winner), (timeBeforeReset*1000)+(rotationTime*1000), winner)
    setTimeout(resetBottlePos, (rotationTime*1000)+(timeBeforeReset*1000), rotationAngle, rotationTime);
}

//Rotates the spinner to its original position.
function resetBottlePos(rotationAngle, rotationTime) {
    let resetPos = (360 - (rotationAngle % 360)) + rotationAngle;
    document.querySelector('.arrow').style.transform = 'rotate(' + resetPos + 'deg)';
    setTimeout(resetRotation, (rotationTime*1000));
}

/*Resets the spinner's rotation in css without the user seeing it
* so the rotation value isn't just incremented every game.
* It starts with setting the rotation time to 0, and resets the rotation on the spinner.
* */
function resetRotation() {
    document.querySelector('.arrow').style.transition = 'all 0s ease-in-out';
    document.querySelector('.arrow').style.transform = 'rotate(0deg)';
}
