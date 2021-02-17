const express = require('express');
const app = express();
var path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;

/*App Data*/
let users = [];

function newID(){
  let id = users.length + 1;
  users.push(id);
  return id;
}


//path som som useren kan få filer fra 
app.use('/clientjs', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/resources')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('/'));

io.on('connection', (socket) => {
  const id = newID();
  console.log('a user connected');
  socket.emit('connection', id);
  socket.on('disconnect', () => {
    console.log('user disconnected')
    for(let i = 0; i < users.length; i++){
      if(users[i].id == id)
        users[i] = 0;
      
    }
  })
});

io.on('connection', (socket) => {
  socket.on('msg', (msg, name) => {
    console.log(name + ": " + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('msg', (msg, name) => {
    io.emit('msg', msg, name);
  });
});


http.listen(PORT, () => {
  console.log(`Welcome to Akvario @ *:${PORT}`);
});