const socket = io();
const fade = document.getElementById("fade");
const loginBox = document.getElementById("loginbox");
const btn = document.getElementById("btn");
const nameBox = document.getElementById("name");

let myID = null;
let user = "";

socket.on('connection',(user) =>{
  //sets myID to the users id and generates the body and enables it to move
  myID = user.id;
});

socket.on('new user', (user)=>{

  btn.addEventListener("click", () =>{
    generateUser(user);
    userMove(findIndexID(users, myID));
    
  //user rotates when the mouse moves 
  window.addEventListener("mousemove",(e) => {userRotation(e);}, false);
  });

});

//setTimeout(() =>{console.log(myID);}, 100);




function send(){
  user = nameBox.value;
  socket.emit('new user', user); 
  fade.style.display = "none";
  loginBox.style.display = "none";
}

