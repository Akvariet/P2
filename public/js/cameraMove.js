let cameramoveAllowed = true, movingCamera = false;
let posLeft=0, posTop=0;
const mouseCoordinates = {x: 0, y: 0};

export function updateMouseCoordinates(e){
    mouseCoordinates.x = e.clientX, mouseCoordinates.y = e.clientY;
}

export function getcameramove(value){
    cameramoveAllowed = value;
}

export function checkMouseOutsideWindow(){
    cameramoveAllowed = false;
}

export function checkMouseInsideWindow(){
    cameramoveAllowed = true;
}

export function useCameraMove() {
    window.main = () => {
        window.requestAnimationFrame(main);
        cameraMove();
    }

    document.onmousemove = updateMouseCoordinates;
    document.onmouseleave = checkMouseOutsideWindow;
    document.onmouseenter = checkMouseInsideWindow;
    window.main();
}

function cameraMove(){
  if (cameramoveAllowed){
    const cameraVelocity = 6.12; // px
    
    let space = document.getElementById("space");
    
    // defines border size according to the window size
    let boarderSize = 100; // px
    let w = window.innerWidth, h = window.innerHeight;
    let wBorderLeft = boarderSize, wBorderRight = w - boarderSize;
    let hBorderTop = boarderSize, hBorderBottom = h - boarderSize;

    // defines position of element in comparison with the viewport
    let bodyRect = document.body.getBoundingClientRect();

    // finds midpoint of screen
    let origoX = (window.innerWidth / 2) - bodyRect.left;
    let origoY = (window.innerHeight / 2) - bodyRect.top;

    // creates relative position of mouse on midpoint of screen
    let mouseX = -(origoX - mouseCoordinates.x + bodyRect.left);
    let mouseY = origoY - mouseCoordinates.y + bodyRect.top;

    // gives the angle in radians (is negative value past pi)
    let angle = Math.atan2(mouseY,mouseX); 
    
    let a = Math.cos(angle);
    let giveX = -((a / Math.cos(0.698132))*cameraVelocity) // 40 degrees in radians is 0.698132

    let b = Math.sin(angle);
    let giveY = ((b / Math.sin(0.698132))*cameraVelocity)

    if (mouseCoordinates.x < wBorderLeft){
        posLeft += cameraVelocity;
        posTop += bodyRect.top + giveY;

        movingCamera = true;
    }
    else if (mouseCoordinates.x > wBorderRight){
        posLeft -= cameraVelocity;
        posTop += bodyRect.top + giveY;

        movingCamera = true;
    }
    else if (mouseCoordinates.y < hBorderTop){
        posLeft += bodyRect.left + giveX;
        posTop += cameraVelocity;

        movingCamera = true;
    }
    else if (mouseCoordinates.y > hBorderBottom){
        posLeft += bodyRect.left + giveX;
        posTop -= cameraVelocity;

        movingCamera = true;
    }
    
    if (movingCamera){
        space.style.left = posLeft + "px";
        space.style.top = posTop + "px";
        
        movingCamera = false;
        
        // Popupmenu: hides popupmenu upon moving camera
        const popup = document.getElementById("menuPopUp");
        popup.style.display = "none";
    }
  }
}

