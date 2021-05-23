let cameramoveAllowed = false;
let posLeft=0, posTop=0;
const mouseCoordinates = {x: 0, y: 0};
let target = {
    left: 0,
    top:  0
};

function updateMouseCoordinates(e){
    mouseCoordinates.x = e.clientX;
    mouseCoordinates.y = e.clientY;
}

export function useCameraMove() {
    document.onmousemove = updateMouseCoordinates;
    document.onmouseout = () => cameramoveAllowed = false; // if mouse leaves window, denies cameramove
}

export function moveCamera(){
    document.onmouseover = () => cameramoveAllowed = true; // if mouse enters window, allows cameramove
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

        if( dist > 0.5)
            target = {
                left: target.left + (mouseX * 0.01),
                top:  target.top  + (mouseY * 0.01)
            };

        
        let appendLeft = ((target.left - posLeft) * 0.1);
        let appendTop = (target.top - posTop) * 0.1;

        // sets the appends to 0 if below 0.5
        appendLeft = (Math.abs(appendLeft) > 0.5) ? appendLeft : 0
        appendTop = (Math.abs(appendTop) > 0.5) ? appendTop : 0;

        // appends the values to camera position values.
        posLeft += appendLeft;
        posTop  += appendTop;

        // moves camera to new position, if updated
        space.style.left = posLeft + "px";
        space.style.top = posTop + "px";

        if (appendLeft != 0 && appendTop != 0){
            document.dispatchEvent(new CustomEvent('cameramove'));
        }

    }
}

export function centerMe(){
    const space = document.getElementById("space");
    cameramoveAllowed = false;
    mouseCoordinates.x = 0;
    mouseCoordinates.y = 0;
    
    
    space.style.left = 0; posLeft = 0; target.left = 0;
    space.style.top = 0;  posTop = 0;  target.top = 0;
    
}