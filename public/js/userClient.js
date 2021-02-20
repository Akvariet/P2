/* Synced users array*/
let users = [];



/*generates new user from user object */
function generateUser(user){
  users.push(user);
  const i = findIndexID(users, user.id);

  generateBody(i, user.id);
}



/*Generates HTML */
function generateBody(i ,id){
  const body = document.createElement("div"); // this is the body of the user
  const arrow = '<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.328031 13.449599" height="20px" width="20px"><g transform="translate(-91.411618,-71.178162)"><g><path d="m 345.7462,274.54091 c 0.82399,3.92069 1.4126,7.88738 1.7626,11.87874 0.4234,4.82846 0.42341,12.70724 10e-6,17.5357 -0.31671,3.6118 -0.82884,7.20385 -1.53415,10.76031 -0.92943,4.68658 1.30847,6.46831 5.44756,4.07875 l 8.78623,-5.07241 a 226183.95,226183.95 149.99924 0 0 15.78977,-9.11651 l 9.67765,-5.58809 a 5.2634256,5.2634256 89.998346 0 0 -2.6e-4,-9.11639 l -9.91419,-5.7239 a 1153838.2,1153838.2 29.999328 0 0 -15.31587,-8.84238 l -8.94831,-5.16608 c -4.47177,-2.58166 -6.81263,-0.67902 -5.75104,4.37226 z" transform="scale(0.26458333)"/></g></g></svg>';

  /*
  sets id and classes for the body element, 
  and appends the svg arrow to the body.
  */
  body.setAttribute('id', `${users[i].id}`);
  body.setAttribute('class', 'user');
  body.innerHTML = arrow;

  /*updates initial pos of the user*/
  users[i].pos[1] = body.style.top = users[i].pos[1] + "%";
  users[i].pos[0] = body.style.left = users[i].pos[0] + "%";

  /*
  Sets the color of the user to what is specified in the
  user object and appends it to the space div. myName appends the name to body
  */
  body.style.backgroundColor = `rgb(${users[i].color[0]},${users[i].color[1]},${users[i].color[2]})`;
  body.style.fill = `rgb(${users[i].color[0]},${users[i].color[1]},${users[i].color[2]})`;
  document.getElementById("space").appendChild(body);
  myName(i, id);
}



/*generates name element */
function myName(i, id){
  const text = document.createElement("h3");
  text.innerHTML = users[i].name
  text.setAttribute('class', 'name');
  text.setAttribute('id', id + '_name');
  document.getElementById(id).appendChild(text);
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
  const i = findIndexID(users, myID);
  const user = document.getElementById(myID);
  const name = document.getElementById(myID + '_name');
  const space = document.getElementById("space");


  /*updates the mouse pos relative to the space div */
  let mouseX = e.clientX - space.offsetLeft;
  let mouseY = e.clientY - space.offsetTop;

  /*updates user pos from middle*/
  let userX = user.offsetTop - mouseY + 35;
  let userY = user.offsetLeft - mouseX + 35;

  /*magic math to make the user rotate correctly */
  let o = users[i].rad = -1 * Math.atan2(userY, userX);

  /*applies the rotation to the user and inverts it for the name*/
  user.style.transform = "rotate(" + o + "rad)";
  name.style.transform = "rotate(" + -1*o + "rad)";
}



/*enables the user to move around */
function userMove(i) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const user = document.getElementById(users[i].id);

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
    users[i].pos[0] = (user.offsetTop - pos2);
    users[i].pos[1] = (user.offsetLeft - pos1);

    user.style.top = users[i].pos[0] + "px";
    user.style.left = users[i].pos[1] + "px";

    /*USER COMMUNICATION WITH SERVER SHOULD HAPPEN HERE*/
  }

  function closeDragUser() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}