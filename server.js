/*express and node stuff */
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const spinner = require('./scripts/backend-spinner.js');
const PORT = 3000;

/*for doing io stuff*/
const io = require('socket.io')(http);

/*our modules*/
const user = require("./scripts/user");

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

// Sends the html to the spinner game when user goes to the dir /spinner
app.get('/spinner', (req, res) => {
  res.sendFile(__dirname + '/public/frontend-spinner.html');
});

/*io.on is the server listening*/
io.on('connection', (socket) => {

  //sets the socket id to the user id
  socket.id = user.createUser(user.newID());

  //index where this user is in users array
  const i = user.findIndexID(user.users, socket.id);

  //shows all active ids and free ids
  user.showAll();
  console.log(`user ${socket.id} connected`);
  user.showNewProp(i);

  //sends the correct user object to client
  socket.emit('connection', user.users[i]);

  socket.on('disconnect', () => {
    //when user disconnects do this
    console.log(`user ${socket.id} disconnected`);

    //deletes user when client disconnets
    user.deleteID(socket.id);
    user.showAll();
  });
});

// when the server receives the message 'start game' start the spinning game
io.on('connection', (socket) => {
  socket.on('start game', () => {
    const spin = spinner.spin( // runs the backend spinner
        [
          {top: 266, left: 216},
          {top: 218, left: 581},
          {top: 559, left: 627},
          {top: 469, left: 249}
        ]
    );
    console.log(spin);
    io.emit('game', spin.rot, spin.result); // sends back the rotation of the spinner and the result of the game
  });
});

/*listens to PORT set on top*/
http.listen(process.env.PORT || PORT, () => {
  console.log(`Welcome to Akvario @ *:${PORT}`);
});
