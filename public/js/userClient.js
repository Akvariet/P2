
function instantiateUser(user){
  const arrow = '<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.328031 13.449599" height="20px" width="20px"><g transform="translate(-91.411618,-71.178162)"><g><path d="m 345.7462,274.54091 c 0.82399,3.92069 1.4126,7.88738 1.7626,11.87874 0.4234,4.82846 0.42341,12.70724 10e-6,17.5357 -0.31671,3.6118 -0.82884,7.20385 -1.53415,10.76031 -0.92943,4.68658 1.30847,6.46831 5.44756,4.07875 l 8.78623,-5.07241 a 226183.95,226183.95 149.99924 0 0 15.78977,-9.11651 l 9.67765,-5.58809 a 5.2634256,5.2634256 89.998346 0 0 -2.6e-4,-9.11639 l -9.91419,-5.7239 a 1153838.2,1153838.2 29.999328 0 0 -15.31587,-8.84238 l -8.94831,-5.16608 c -4.47177,-2.58166 -6.81263,-0.67902 -5.75104,4.37226 z" transform="scale(0.26458333)"/></g></g></svg>';
  const id    = user.id;
  const color = user.color;

  //Create the users body.
  const body = document.createElement("div");

  /* Sets id and classes for the body element,
  and appends the svg arrow to the body. */

  body.setAttribute('id', id);
  body.setAttribute('class', 'user');
  body.innerHTML = arrow;

  /* Updates initial pos of the user*/
  user.pos.top  = body.style.top  = user.pos.top + "px";
  user.pos.left = body.style.left = user.pos.left + "px";

  /* Sets the color of the user to what is specified in the
  user object and appends it to the space div. */
  body.style.backgroundColor = color;
  body.style.fill = color;
  document.getElementById("space").appendChild(body);

  const nameLabel = document.createElement("h3");
  nameLabel.innerHTML = user.name
  nameLabel.setAttribute('class', 'name');
  nameLabel.setAttribute('id', id + '_name');
  document.getElementById(id).appendChild(nameLabel);
}

//enables the user to rotate
function userRotation(e, user, socket){
  /* Sets some constants to be used later*/
  const id    = user.id;
  const userElement  = document.getElementById(id);
  const name  = document.getElementById(id + '_name');
  const space = document.getElementById("space");


  //updates the mouse pos relative to the space div
  let mouseX = e.clientX - space.offsetLeft;
  let mouseY = e.clientY - space.offsetTop;

  /*updates user pos from middle*/
  let userX = userElement.offsetTop - mouseY + 35;
  let userY = userElement.offsetLeft - mouseX + 35;

  /*magic math to make the user rotate correctly */
  let o = user.rad = -1 * Math.atan2(userY, userX);

  //applies the rotation to the user and inverts it for the name
  userElement.style.transform = "rotate(" + o + "rad)";
  name.style.transform = "rotate(" + -1*o + "rad)";

  //user rotation is send to the server here
  socket.emit('update-user-rot', user.id, user.rad);
}

//enables the user to move around
function userMove(user, socket) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const id = user.id;
  const userElement = document.getElementById(id);

  userElement.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragUser;
    document.onmousemove = userDrag; 
  }

  function userDrag(e) {
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    user.pos.top = (userElement.offsetTop - pos2);
    user.pos.left = (userElement.offsetLeft - pos1);

    userElement.style.top = user.pos.top + "px";
    userElement.style.left = user.pos.left + "px";

    //user position is send to the server here
    socket.emit('update-user-pos', user.id, user.pos);
  }

  function closeDragUser() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function deleteDisconnectedUser(id){
  const userElement = document.getElementById(id);
  if (userElement !== null)
    userElement.remove();
}
