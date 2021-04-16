import {isCameraMoving} from './popUpMenu.js';

export let cameramoveAllowed = true;
let posLeft=0, posTop=0;
const mouseCoordinates = {x: 0, y: 0};

export function updateMouseCoordinates(e){
    mouseCoordinates.x = e.clientX, mouseCoordinates.y = e.clientY;
}


export function useCameraMove() {
    // defines window main to run every frame if called
    window.main = () => {
        window.requestAnimationFrame(main);
        cameraMove();
    }

    document.onmousemove = updateMouseCoordinates;
    document.onmouseleave = cameramoveAllowed = false; // if mouse leaves window, denies cameramove
    document.onmouseenter = cameramoveAllowed = true; // if mouse enters window, allows cameramove
    window.main(); // updates cameraMove every frame
}

function cameraMove(){
    if (cameramoveAllowed){
        let space = document.getElementById("space");

        const cameraVelocity = 6.12; // px
        const boarderSize = 30; // px

        // finds midpoint of screen
        let origoX = window.innerWidth / 2;
        let origoY = window.innerHeight / 2;

        // creates relative position of mouse on midpoint of screen
        let mouseX = origoX - mouseCoordinates.x;
        let mouseY = origoY - mouseCoordinates.y;

        // percentage from midpoint to -minX and +maxX
        let percX = mouseX / origoX;
        let percY = mouseY / origoY;

        // relative camera velocity scaled with %x or %y
        let giveX = percX * cameraVelocity;
        let giveY = percY * cameraVelocity;

        if (mouseOnCorner()){
        // move camera with full cameraVelocity
        posLeft += giveVelocityCamera(giveX);
        posTop += giveVelocityCamera(giveY);
        }
        else if (mouseOnBorder()){
        // move camera with full cameraVelocity in either x and y, while the other value varies according to its relative camera velocity, giveX or giveY
        posLeft += (Math.abs(giveX) > Math.abs(giveY)) ? giveVelocityCamera(giveX) : giveX;
        posTop += (Math.abs(giveY) > Math.abs(giveX)) ? giveVelocityCamera(giveY) : giveY;
        }
    
        // moves camera to new position, if updated
        space.style.left = posLeft + "px";
        space.style.top = posTop + "px";

        if (isCameraMoving()){
        // hides popupmenu upon camera moving;
        const popup = document.getElementById("menuPopUp");
        popup.style.display = "none";
        }


        function giveVelocityCamera(giveCoordinate){
        // gives positive or negative cameraVelocity, depending on the coordinate being positive or negative
        return (giveCoordinate >= 0) ? cameraVelocity : -cameraVelocity; 
        }
        
        function mouseOnBorder(){
        if(mouseCoordinates.y < boarderSize || mouseCoordinates.y > window.innerHeight - boarderSize 
            || mouseCoordinates.x < boarderSize || mouseCoordinates.x > window.innerWidth - boarderSize)
            return true
        else return false;
        }

        function mouseOnCorner(){
        if(mouseCoordinates.x <= boarderSize && mouseCoordinates.y <= boarderSize || // top left corner
            mouseCoordinates.x >= window.innerWidth - boarderSize && mouseCoordinates.y <= boarderSize || // top right corner 
            mouseCoordinates.x <= boarderSize && mouseCoordinates.y >= window.innerHeight - boarderSize || // bottom left corner
            mouseCoordinates.x >= window.innerWidth - boarderSize && mouseCoordinates.y >= window.innerHeight - boarderSize)  //bottom right corner
            return true
        else return false;
        }
    }
}

