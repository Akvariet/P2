import {UserCollection, ColorPicker} from "./user.js";
import {spinBottle} from "./frontend-spinner.js";

const socket = io({ autoConnect: false });

const overlay = document.querySelector('.login-form-wrapper');
const form = document.getElementById('FIXME');
const input = document.getElementById('username');

const allUsers = new UserCollection();
const colorPicker = new ColorPicker();

const peers = {};

let myColor = 'red';

socket.open();

socket.on('available-colors', colors => {
  const colorPalette = colorPicker.colorsForLoginScreen;
  colorPalette.forEach((value, index) => colorPalette[index] = colors[index]);
  displayUser();


  //when the name has been submitted do this
  form.addEventListener('submit', e => {
    //don't do the default things: such as reload the page
    e.preventDefault();

    //hide overlay
    overlay.style.display = "none";

    //send name to server so it can generate a user and id
    socket.emit('new-client', input.value, myColor);

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
        doUser.addEventListener('onclick', e => {
          if (isUserMoving(myUser)) menuPopUp(e);
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

        // spinner element and the spinners style
        const spinnerElement = document.getElementById('spinner');
        const spinnerDiv = document.querySelector('.spinner');
        const spinnerRot = getComputedStyle(spinnerDiv);
        // when someone clicks the spinner
        spinnerElement.addEventListener('click', () => {
          if (spinnerRot.transform === 'matrix(1, 0, 0, 1, 0, 0)') // is the spinner in the starting position?
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

        socket.on('user-delete', id => {
          if(peers[id]) peers[id].close();
          deleteDisconnectedUser(id)
        });
      });
    });
  });
});


function displayUser() {
  const userPreview = document.getElementById('user-preview');
  const tempUser = createUserHTML(UserCollection.make(0, 'Username'));
  const nameInputField = document.getElementById('username');

  const name = tempUser.querySelector('.name');
  const body = tempUser.querySelector('.body');
  const colors = colorPicker.colorsForLoginScreen;

  const colorItems = document.getElementsByClassName("coloritem");

  for(let i of colors){
    createColorItem(i);
  }

  Array.from(colorItems).forEach((colorItems)=>{
    colorItems.addEventListener("click", setUserColor);
  });

  userPreview.append(tempUser);

  nameInputField.addEventListener('input',e => updateName(e))

  setBodyColor(colorPicker.previewShade('red'));

  function createColorItem(color){
    const htmlColorPicker = document.querySelector('.color-picker-items');
    const newColor = document.createElement("div");
    newColor.setAttribute("class", "coloritem");
    newColor.setAttribute("id", color);

    const hslColor = colorPicker.previewShade(color);
    newColor.style.backgroundColor = hslColor;

    htmlColorPicker.appendChild(newColor);
  }

  function setUserColor(){
    const colorItems = document.getElementsByClassName("coloritem");
    const color = this.getAttribute("id");
    const hslColor = colorPicker.previewShade(color);

    Array.from(colorItems).forEach((colorItems)=>{
      colorItems.classList.remove("color-item-active");
    });
    this.classList.add("color-item-active");
    updateColor(hslColor, color);
  }

  function updateName(e){
    name.innerHTML = e.target.value;
  }


  function updateColor(hslColor, color){
    setBodyColor(hslColor);
    myColor = color;
  }

  function setBodyColor(color){
    body.style.fill = color;
    body.style.backgroundColor = color;
  }
}