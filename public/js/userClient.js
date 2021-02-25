/* Synced users array*/
let users = [];



/*generates new user from user object */
function generateUser(user){
  users.push(user);
  const i = findIndexID(users, user.id);

  generateBody(i, user.id);
}

// Creates the HTML to the user using the template in index.html
function generateBody(i ,id){
  //Takes the content of the template, creates a copy of it that is edited
  const userTemp = document.getElementById("userTemplate").content;
  const userHTML = document.importNode(userTemp,true);
  const userBody = userHTML.querySelector(".body");
  const userContainer = userHTML.querySelector(".user-container");

  //Gives the container and the body an id
  userContainer.setAttribute('id', id);
  userBody.setAttribute('id', id + '_body');

  // updates initial pos of the user
  users[i].pos[1] = userContainer.style.top = users[i].pos[1] + "%";
  users[i].pos[0] = userContainer.style.left = users[i].pos[0] + "%";

  //Sets the color of the user to what is specified in the
  userBody.style.backgroundColor = `rgb(${users[i].color[0]},${users[i].color[1]},${users[i].color[2]})`;
  userBody.style.fill = `rgb(${users[i].color[0]},${users[i].color[1]},${users[i].color[2]})`;

  //finds the name of the
  const text = userHTML.querySelector('.name');
  text.textContent = users[i].name;
  text.setAttribute('id', id + '_name');

  //Appends the edited copy of the template to the space
  document.getElementById("space").appendChild(userHTML);
}

/*finds index of user by id*/
function findIndexID(arr, id){
  for(let i = 0; i < arr.length; i++){
    if(arr[i].id == id){
      return i;
    }
  }
  return -1;
}

/*enables the user to rotate */
function userRotation(e){
  /*sets some constants to be used later*/
  const i = findIndexID(users, socket.id);
  const user = document.getElementById(socket.id + '_body');
  const container = document.getElementById(socket.id);
  const space = document.getElementById("space");


  /*updates the mouse pos relative to the space div */
  let mouseX = e.clientX - space.offsetLeft;
  let mouseY = e.clientY - space.offsetTop;

  /*updates user pos from middle*/
  let userX = container.offsetTop - mouseY + (115/2);
  let userY = container.offsetLeft - mouseX + ((115+98)/2);

  /*magic math to make the user rotate correctly */
  let o = users[i].rad = -1 * Math.atan2(userY, userX);

  /*applies the rotation to the user*/
  user.style.transform = "rotate(" + o + "rad)";
}

/*enables the user to move around */
function userMove(i, socket) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const container = document.getElementById(users[i].id);
  const user = document.getElementById(users[i].id + '_body');

  user.onmousedown = dragMouseDown;

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
    users[i].pos[0] = (container.offsetTop - pos2);
    users[i].pos[1] = (container.offsetLeft - pos1);

    container.style.top = users[i].pos[0] + "px";
    container.style.left = users[i].pos[1] + "px";

    /*USER COMMUNICATION WITH SERVER SHOULD HAPPEN HERE*/
    socket.emit('user-pos', users[i].pos);
  }

  function closeDragUser() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}