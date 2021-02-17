


//Sends a request to the backend to start the game
function requestGameStart() {
    let jsonData = {}
    jsonData.name = name;
    jsonData.userId = id;
    jsonData.startGame = true;




}


//Starts the game when a user clicks on the bottle
function spinBottle() {
    let rotationAngle = 300;
    let rotationTime = 5;
    let timeBeforeReset = 2;

    document.querySelector('.arrow').style.transition = 'all ' + rotationTime + 's ease-in-out';
    rotateBottle(rotationAngle);

    //When the "winner" is found wait 3 seconds before replacing bottle
    setTimeout(resetBottlePos, (rotationTime*1000)+(timeBeforeReset*1000), rotationAngle, rotationTime);
}

//Rotates the bottle as the game begins
function rotateBottle(rotationAngle) {
    console.log("Rotating...");
    document.querySelector('.arrow').style.transform = 'rotate('+ rotationAngle +'deg)';
}

//The bottle is placed at a fixed position
function resetBottlePos(rotationAngle, rotationTime) {
    console.log("Repositioning..");
    let resetPos = (360 - (rotationAngle % 360)) + rotationAngle;
    document.querySelector('.arrow').style.transform = 'rotate(' + resetPos + 'deg)';
    setTimeout(resetRotate, (rotationTime*1000));
}

function resetRotate() {
    console.log("Resetting..");
    document.querySelector('.arrow').style.transition = 'all 0s ease-in-out';
    document.querySelector('.arrow').style.transform = 'rotate(0deg)';
    //setTimeout(function(){document.querySelector('.arrow').style.transition = 'all 5s ease-in-out'},
    //           1000);
}
