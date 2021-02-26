import {UserCollection} from "./user.js";
import {spinBottle} from "./frontend-spinner.js";

const socket = io({ autoConnect: false });
const overlay = document.getElementById('fade');
const form = document.getElementById('nameForm');
const input = document.getElementById('username');

const allUsers = new UserCollection();

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

      Object.keys(serverUsers).forEach(id => instantiateUser(allUsers.add(serverUsers[id])));

      const myUser = allUsers.get(id);

      userMove(myUser, socket);

      // TODO: Spinner element should be replaced by an actual spinner object.
      const spinner = {id: 'spinner', name: 'spinner', color: 'red', pos: {top: 300, left: 300}, rad: 0};
      const spinnerElement = instantiateUser(spinner);

      spinnerElement.addEventListener('click', () => {
        socket.emit('start-spinner');
      });

      //user rotates when the mouse moves
      window.addEventListener("mousemove",e => userRotation(e, myUser, socket), false);

      socket.on('new-user-connected', newUser =>{
        allUsers.add(newUser);
        instantiateUser(newUser);
      });

      //updating user position
      socket.on('update-user-pos', (id, pos)=>{
        const user = document.getElementById(id);

        user.style.top  = pos.top + "px";
        user.style.left = pos.left + "px";
      });

      //updating user rotation
      socket.on('update-user-rot', (id, rot)=>{
        const user = document.getElementById(id);
        user.style.transform =`rotate(${rot}rad)`;
      });

      socket.on('spinner-result', (rotAngle, winner) => {
        spinBottle(rotAngle, winner); //Start the game
      });

      socket.on('user-delete', id => deleteDisconnectedUser(id));
    });
  });
});