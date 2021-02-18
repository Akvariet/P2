const socket = io();

socket.on('connection', function(id){
  console.log(id);
});


/*App
const userID = createUser();
const user = document.getElementById(userID);

move(user);

window.addEventListener("mousemove", function(e){userRotation(e);}, false);*/