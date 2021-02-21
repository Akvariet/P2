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



//path that clients can use, this means it cant access core server files
app.use('/clientjs', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));
app.use(express.static('public'));

//sends index.html to client browser
app.use('/', indexRouter);



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



//listens to PORT set on top
http.listen(port, () => {
  console.log(`Welcome to Akvario @ *:${port}`);
});