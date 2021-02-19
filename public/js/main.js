const socket = io();
let myID = null;

socket.on('connection', function(user){

  /*sets myID to the users id and generates the body and enables it to move*/
  myID = user.id;
  generateUser(user);
  userMove(findIndexID(users, myID));

  /*user rotates when the mouse moves */
  window.addEventListener("mousemove",function(e){userRotation(e);}, false);

});



//setTimeout(() =>{console.log(myID);}, 100);
