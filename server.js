//express and path modules
const express = require('express');
const app = express();
const path = require('path');

//io and http modules
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//our modules and consts
const user = require("./scripts/user");
const indexRouter = require('./routes/index');
const port = process.env.PORT || 3000;
const spinner = require('./scripts/backend-spinner.js');

//path that clients can use, this means it cant access core server files
app.use('/clientjs', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));
app.use(express.static('public'));

//sends index.html to client browser
app.use('/', indexRouter);

// Sends the html to the spinner game when user goes to the dir /spinner
app.get('/spinner', (req, res) => {
  res.sendFile(__dirname + '/public/frontend-spinner.html');
});

//io.on is the server listening
io.on('connection', (socket) => {
  //Creates user with a unique id
  socket.on('client-name', (client)=>{
    
    user.createUser(client, socket.id);

    //index where this user is in users array
    const i = user.findIndexID(user.users, socket.id);

    //shows all active ids and free ids
    console.log(`user ${socket.id} connected`);
    user.showNewProp(i);
    user.showAll();

    //sends the correct user object to client
    socket.emit('res-myobject', user.users[i]);
  });

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

//listens to PORT set on top
http.listen(port, () => {
  console.log(`Welcome to Akvario @ *:${port}`);
});
