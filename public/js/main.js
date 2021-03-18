import {UserCollection} from "./user.js";
import {spinBottle} from "./frontend-spinner.js";

const socket = io({ autoConnect: false });
const overlay = document.querySelector('.login-form-wrapper');
const form = document.getElementById('FIXME');
const input = document.getElementById('username');

const coloritems = document.getElementsByClassName("coloritem");
const colors = ['hsl(354, 88%, 71%)', 'hsl(118, 18%, 66%)', 'hsl(343, 40%, 59%)', 'hsl(272, 15%, 42%)', 'hsl(4, 100%, 74%)', 'hsl(26, 100%, 78%)', 'hsl(208, 40%, 35%)', 'white'];

const allUsers = new UserCollection();
const peers = {};

for(let i of colors){
  createColorItem(i);
}

Array.from(coloritems).forEach((coloritems)=>{
  coloritems.addEventListener("click", setUserColor);
});

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
    //connect to the pper server with "undefined" ID (generates uuid instead)
    const myPeer = new Peer(id, {
      secure: true, 
      host: 'audp2p.herokuapp.com', 
      port: 443,
    });

    socket.on('connected-users', serverUsers =>{

      Object.keys(serverUsers).forEach(id => instantiateUser(allUsers.add(serverUsers[id])));

      const myUser = allUsers.get(id);

      userMove(myUser, socket);

      const doUser = document.getElementById(socket.id);
      doUser.addEventListener('click', (e) =>{
        if (moveDiff(myUser)){
          menuPopUp(e);
        }
      });

      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
        //stream audio 
      }).then(stream => {
        //? when somebody sends data then this / already connected users
        myPeer.on('call', call => {
          //? call must be answered or no connection / answers with own audio stream
          call.answer(stream);
      
          //creates new audio object 
          const audio = document.createElement('audio');
      
          //when recieving old stream add it to audio container
          call.on('stream', userAudioStream => {
            addAudioStream(audio, userAudioStream);
          });
        });
      
        //when a new user connects. make audio object of that user.
        socket.on('user-connected', userId => {
          connectToNewUser(userId, stream, myPeer, peers);
        });
      });

        //when connected to the peer server do this
      myPeer.on('open', id=>{ socket.emit('voice', id); });

      //user rotates when the mouse moves
      window.addEventListener("mousemove", e => userRotation(e, myUser, socket), false);

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
        const user = document.getElementById(id + '_body');
        user.style.transform =`rotate(${rot}rad)`;
      });

      socket.on('spinner-result', (rotAngle, winner) => {
        spinBottle(rotAngle, winner); //Start the game
      });

      socket.on('user-delete', id => {
        if(peers[id]) peers[id].close();
        deleteDisconnectedUser(id)
      });
    });
  });
});