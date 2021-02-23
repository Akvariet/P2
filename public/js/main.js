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

  //send name to server so it can generate a user and id
  socket.emit('client-name', input.value);

  //when recieving id from server do this
  socket.on('connection', id =>{
    const myID = id;
    console.log(myID);
    
    socket.on('res-users',(serverUsers)=>{
      syncUsers(serverUsers, myID);

      //sets myID to the users id and generates the body and enables it to move
      generateBody(myID);
  
      userMove(findIndexID(users, socket.id));
  
      //user rotates when the mouse moves
      window.addEventListener("mousemove",function(e){userRotation(e);}, false);
  
      socket.on('test', (user) =>{
        if(user.id != myID){
          users.push(user);
          generateBody(user.id);
        } 
      });

      //updating user position
      socket.on('user-pos', (id, pos)=>{
        const user = document.getElementById(id);
        

        user.style.top = pos[0] + "px";
        user.style.left = pos[1] + "px";
      });

      //updating user rotation
      socket.on('user-rot', (id, rot)=>{
        const user = document.getElementById(id);
        user.style.transform =`rotate(${rot}rad)`;
      });

      socket.on('user-delete', id =>{
        deleteID(id);
      })
    });
  });
});