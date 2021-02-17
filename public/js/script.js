const socket = io();
let name = prompt("name");
const btn = document.getElementById('button');
const input = document.getElementById('textbox');
const output = document.getElementById('msg');

socket.on('connection', function(id){
  output.innerHTML = id;
});



function send(){
  if(input.value){
  socket.emit('msg', input.value, name);
      input.value = '';
  }    
}

socket.on('msg', function(msg, name) {
  let newmsg = document.createElement("p");
  newmsg.innerHTML = name + ": " + msg;
  document.body.appendChild(newmsg);
});



