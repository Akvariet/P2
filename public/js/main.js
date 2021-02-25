import {UserCollection} from "./user.js";

const socket = io({ autoConnect: false });
const overlay = document.getElementById('fade');
const form = document.getElementById('nameForm');
const input = document.getElementById('username');

let allUsers = new UserCollection();

//when the name has been submitted do this
form.addEventListener('submit', e => {
  //don't do the default things: such as reload the page
  e.preventDefault();

  //hide overlay
  overlay.style.display = "none";

  //connect user to server
  socket.open();

  //send name to server so it can generate a user and id
  socket.emit('new-client', input.value);

  // The user has been created on the server with id.
  socket.on('user-created', id =>{

    socket.on('connected-users', serverUsers =>{

      for (const id in serverUsers){
        instantiateUser(allUsers.add(serverUsers[id]));
      }

      const myUser = allUsers.get(id);

      //sets myID to the users id and generates the body and enables it to move

      userMove(allUsers.get(id), socket);

      //user rotates when the mouse moves
      window.addEventListener("mousemove",e => userRotation(e, myUser, socket), false);

      socket.on('new-user-connected', newUser =>{
        if(newUser.id !== id){
          allUsers.add(newUser);
          instantiateUser(newUser);
        }
        else
          console.warn('Received own user connected!');
      });

      //updating user position
      socket.on('update-user-pos', (id, pos)=>{
        const user = document.getElementById(id);

        user.style.top = pos.top + "px";
        user.style.left = pos.left + "px";
      });

      //updating user rotation
      socket.on('update-user-rot', (id, rot)=>{
        const user = document.getElementById(id);
        user.style.transform =`rotate(${rot}rad)`;
      });

      socket.on('user-delete', id => deleteDisconnectedUser(id));
    });
  });
});