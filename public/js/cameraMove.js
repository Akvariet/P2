let cameramoveAllowed = true;
let posLeft=0, posTop=0;
const mouseCoordinates = {x: 0, y: 0};

export function updateMouseCoordinates(e){
    mouseCoordinates.x = e.clientX, mouseCoordinates.y = e.clientY;
}

export function cameraMove(){
  if (cameramoveAllowed){
    let boarderSize = 150; // px
    let cameraVelocity = 6.23; // px

    let space = document.getElementById("space");
    
    // defines border size according to the window size
    let w = window.innerWidth, h = window.innerHeight;
    let wBorderLeft = boarderSize, wBorderRight = w - boarderSize;
    let hBorderTop = boarderSize, hBorderBottom = h - boarderSize;

    // defines position of element in comparison with the viewport
    let bodyRect = document.body.getBoundingClientRect();

    // if inside the window boarder
    if (mouseCoordinates.x > wBorderRight || mouseCoordinates.x < wBorderLeft || mouseCoordinates.y > hBorderBottom || mouseCoordinates.y < hBorderTop){

      // finds midpoint of screen
      let origoX = (window.innerWidth / 2) - bodyRect.left;
      let origoY = (window.innerHeight / 2) - bodyRect.top;
    
      // creates relative position of mouse on midpoint of screen
      let mouseX = -(origoX - mouseCoordinates.x + bodyRect.left);
      let mouseY = origoY - mouseCoordinates.y + bodyRect.top;

      // gives the angle in radians (is negative value past pi)
      let angle = Math.atan2(mouseY,mouseX); 

      /* gives a scalable value of the x- and y-coordinate according to the angle, which the user moves the camera.
          if the mouse position goes in the negative x-, y-coordinate side, it is required to flip the scalable value,
          as angle mod 0.5π resets at origo and the highest angle value will be around -0.1.*/
      let a = (mouseX > 0) ? Math.abs(angle % (Math.PI / 2)) : Math.abs(Math.PI/2 - Math.abs(angle % (Math.PI / 2)));
      let b = (mouseY > 0) ? Math.abs(angle % (Math.PI / 2)) : Math.abs(Math.PI/2 - Math.abs(angle % (Math.PI / 2)));

      // Assigns camera velocity according to relative angle of x- and y-coordinate 
      let giveX = cameraVelocity - cameraVelocity*(a/(Math.PI / 2)); 
      let giveY = cameraVelocity - cameraVelocity*(b/(Math.PI / 2));

      // the values are negative, when e.g. x-coordinate is left side of origo or y-coordinate is bottom side of origo
      giveX = (mouseX <= 0) ? giveX : -giveX;
      giveY = (mouseY <= 0) ? -giveY : giveY;

      // accumulates the coordinates in new variable
      posLeft += bodyRect.left + giveX;
      posTop += bodyRect.top + giveY;

      // sets the position of space to the accumulated values
      space.style.left = posLeft + "px";
      space.style.top = posTop + "px";


      // Popupmenu: hides popupmenu upon moving camera
      const popup = document.getElementById("menuPopUp");
      popup.style.display = "none";
    }
  }
}

export function getcameramove(value){
    cameramoveAllowed = value;
}