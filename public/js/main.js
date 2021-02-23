const socket = io({ autoConnect: false });

const overlay = document.getElementById('fade');
const form = document.getElementById('nameForm');
const input = document.getElementById('username');
//when the name has been submitted do this
form.addEventListener('submit', (e)=>{  
  //don't do the default things: such as reload the page
  e.preventDefault();
  
  //hide overlay
  overlay.style.display = "none";

  //connect user to server
  socket.open();

  //sends client name to server
  socket.emit('client-name', input.value);


  socket.on('res-myobject',(user)=>{
    //sets myID to the users id and generates the body and enables it to move
    generateUser(user);
    userMove(findIndexID(users, socket.id), socket);
    
    const kebab = document.getElementById(users[findIndexID(users, socket.id)].id);
    const menu = document.getElementById('menuPopUp');
    
    kebab.addEventListener('click', (e) =>{
      e.preventDefault();
      menu.style.display = "block";
    });

    //user rotates when the mouse moves
    window.addEventListener("mousemove",function(e){userRotation(e);}, false);
  });   
});