/*
When website gets loaded socket will be init,
and sends a packet to the server
*/
const socket = io();


/*MSG app - delete if making new app*/
let name = prompt("name");
const btn = document.getElementById('button');
const input = document.getElementById('textbox');
const output = document.getElementById('msg');


/*listing to 'connection' port/channel 
when id gets send from server output will be set to id
*/
socket.on('connection', function(id){
  /*stuff it will do when recieving from 'connection' */
  output.innerHTML = id;
});



function send(){
  if(input.value){
    /*socket.emit sends stuff to the server in this
     case on 'msg' port it sends input and name */
  socket.emit('msg', input.value, name);
      input.value = '';
  }    
}

/*receives packet from server
 when server sends something on 'msg' port this picks it up*/
socket.on('msg', function(msg, name) {
  let newmsg = document.createElement("p");
  newmsg.innerHTML = name + ": " + msg;
  document.body.appendChild(newmsg);
});



