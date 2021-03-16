import {UserCollection} from "./user.js";
import {spinBottle} from "./frontend-spinner.js";

const socket = io({ autoConnect: false });
const overlay = document.getElementById('fade');
const form = document.getElementById('nameForm');
const input = document.getElementById('username');

const audioContainer = document.getElementById('aud-container')

const allUsers = new UserCollection();

//when the name has been submitted do this
form.addEventListener('submit', e => {
  //don't do the default things: such as reload the page
  e.preventDefault();

  //hide overlay
  overlay.style.display = "none";

  //connect user to server
  socket.open();

  //connect to the pper server with "undefined" ID (generates uuid instead)
  const myPeer = new Peer(undefined, {
    secure: true, 
    host: 'audp2p.herokuapp.com', 
    port: 443,
  });

  //ALL PEER DATA HERE \/
  //userID and call storage
  const peers = {};

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
        addAudioStream(audio, userAudioStream)
      });
    });
  
    //when a new user connects. make audio object of that user.
    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream, myPeer, peers);
    });
  });
  
  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
  });
  
  //when connected to the peer server do this
  myPeer.on('open', id => {
    socket.emit('voice', id);
  });

  //PEER DATA /\

  //send name to server so it can generate a user and id
  socket.emit('new-client', input.value);

  // The user has been created on the server with id.
  socket.on('user-created', id =>{

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

      // TODO: Spinner element should be replaced by an actual spinner object.
      const spinner = {id: 'spinner', name: '', color: 'red', pos: {top: 300, left: 300}, rad: 0};
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
        const user = document.getElementById(id + '_body');
        user.style.transform =`rotate(${rot}rad)`;
      });

      socket.on('spinner-result', (rotAngle, winner) => {
        spinBottle(rotAngle, winner); //Start the game
      });

      socket.on('user-delete', id => deleteDisconnectedUser(id));
    });
  });
});


