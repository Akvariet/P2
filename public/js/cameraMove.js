import {isCameraMoving} from './popUpMenu.js';
import {getPos, mousePosition, users} from './main.js';

let cameramoveAllowed = true;
let posLeft=0, posTop=0;
const mouseCoordinates = {x: 0, y: 0};
let myUser;
let target = {
    left: window.innerWidth / 2,
    top: window.innerHeight / 2
};


export function updateMouseCoordinates(e){
    mouseCoordinates.x = e.clientX;
    mouseCoordinates.y = e.clientY;
}

export function useCameraMove(id) {
    myUser = users[id];
    document.onmousemove = updateMouseCoordinates;
    document.onmouseout = () => cameramoveAllowed = false; // if mouse leaves window, denies cameramove
    document.onmouseover = () => cameramoveAllowed = true; // if mouse enters window, allows cameramove

}

export function moveCamera(){
    if (cameramoveAllowed){
        let space = document.getElementById("space");

        // finds midpoint of screen
        let origoX = window.innerWidth / 2;
        let origoY = window.innerHeight / 2;

        // creates relative position of mouse on midpoint of screen
        let mouseX = origoX - mouseCoordinates.x;
        let mouseY = origoY - mouseCoordinates.y;

        // percentage from midpoint to -minX and +maxX
        let percX = mouseX / origoX;
        let percY = mouseY / origoY;

        const dist = Math.sqrt(percX * percX + percY * percY);
        const myPos = getPos(myUser);
        myPos.left = origoX - myPos.left;
        myPos.top  = origoY - myPos.top;

        if( dist > 0.5)
            target = {
                left: target.left + (mouseX * 0.01),
                top:  target.top  + (mouseY * 0.01)
            };


        posLeft += (target.left - posLeft) * 0.1;
        posTop  += (target.top - posTop) * 0.1;

        // moves camera to new position, if updated
        space.style.left = posLeft + "px";
        space.style.top = posTop + "px";

        document.dispatchEvent(new CustomEvent('cameramove'));

        if (isCameraMoving()){
            // hides popupmenu upon camera moving;
            const popup = document.getElementById("menuPopUp");
            popup.style.display = "none";
        }

    }
}