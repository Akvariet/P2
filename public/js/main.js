const socket = io();
const fade = document.getElementById("fade");
const loginBox = document.getElementById("loginbox");
const nameBox = document.getElementById("name");

let myID = null;
let user = "";


window.addEventListener("submit", () => {
  user = nameBox.value;
  socket.emit('newuser', user); 
  fade.style.display = "none";
  loginBox.style.display = "none";
});


socket.on('connection', function(user){
  //sets myID to the users id and generates the body and enables it to move
  myID = user.id;
  generateUser(user);
  userMove(findIndexID(users, myID));

  //user rotates when the mouse moves 
  window.addEventListener("mousemove",function(e){userRotation(e);}, false);

});



//setTimeout(() =>{console.log(myID);}, 100);
