/*express and node stuff */
const express = require('express');
const app = express();
var path = require('path');
const http = require('http').createServer(app);
const PORT = 3000;

/*for doing io stuff*/
const io = require('socket.io')(http);


/*App Data - this should be moved to seperate file*/
let users = [];

function newID(){
  let id = users.length + 1;
  users.push(id);
  return id;
}


/*path that clients can use, this means it cant access core server files*/
app.use('/clientjs', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/resources')));

/*sends index.html to client browser*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/*io.on is the server listening*/
io.on('connection', (socket) => {
  /*when new user connects do this */
  const id = newID();
  console.log('a user connected');
  socket.emit('connection', id);
  socket.on('disconnect', () => {
    /*when user disconnects do this*/
    console.log('user disconnected')
    for(let i = 0; i < users.length; i++){
      if(users[i].id == id)
        users[i] = 0;
      
    }
  })
});

io.on('connection', (socket) => {
  /*receive message from client logs to console and sends back to users*/
  socket.on('msg', (msg, name) => {
    console.log(name + ": " + msg);
    io.emit('msg', msg, name);
  });
});

/*listens to PORT set on top*/
http.listen(PORT, () => {
  console.log(`Welcome to Akvario @ *:${PORT}`);
});