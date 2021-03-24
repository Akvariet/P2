import express from 'express';
import path from 'path';
import {createServer} from 'http';
import * as socket_io from 'socket.io';

import {UserCollection, colorPicker} from './public/js/user.js'
import indexRouter from './routes/index.js';
import spin from './scripts/backend-spinner.js';

//express and path modules
const app = express();
const server = createServer(app);
const io = new socket_io.Server(server);
//const port = process.env.PORT || 3000;
const host = '127.0.0.1';
const port = 3200;


//-----------------------PEERSERVER HERE!-------------------------
import {PeerServer} from 'peer';
import * as voice from './scripts/voicep2p.js'
const peerPort = 3201;
const peerServer = PeerServer({port: peerPort, path: '/'});

peerServer.on('connection', voice.conn);
peerServer.on('disconnect', voice.disconn);
//----------------------------------------------------------------

// Path that clients can use, this means it can't access core server files-
app.use('/clientjs', express.static(path.join(path.resolve(), '/node_modules/socket.io/client-dist')));
app.use(express.static('public'));

// Send index.html to client.
app.use('/', indexRouter);

const users = new UserCollection();

// Socket.io listens for connections.
io.on('connection', (socket) => {

  socket.emit('available-colors', colorPicker.previewColors());

  socket.on('new-client', (client, color)=>{
    color = colorPicker.selectColor(color);
    const id   = socket.id;
    const user = users.add(UserCollection.make(id, client, color));
    //shows all active ids and free ids
    console.log(`${client} with id ${id} connected`);

    // Send new user to the other clients.
    io.emit('new-user-connected', user);

    // Send id and other users to new client.
    socket.emit('user-created', id);
    socket.emit('connected-users', users.users);
  });

    //when a user is connected to the peer server do this
  socket.on('voice', (id) => {
    socket.broadcast.emit('user-connected', id)
  });
  
  //for updating user position
  socket.on('update-user-pos', (id, pos) => {
    const user = users.get(id);
    if(user === undefined)
      return;
    user.pos = pos;
    
    socket.broadcast.emit('update-user-pos', id, pos);
  });

  //for updating user rotation
  socket.on('update-user-rot', (id, rot)=>{
    const user = users.get(id);
    if(user === undefined)
      return;

    user.rad = rot;

    socket.broadcast.emit('update-user-rot', id, rot);
  });

  // Starts the spinner game
  socket.on('start-spinner', () => {
    const result = spin(users.positions(), {top : 500, left : 750}); // TODO: Get the spinners positions so they arent fixed
    const winner = (users.get(result.winner)).name;
    console.log(`Winner is ${winner}`);
    io.emit('spinner-result', result.rot, winner); // sends back the rotation of the spinner and the result of the game
  });

  //when user disconnects do this
  socket.on('disconnect', () => {
    const id = socket.id;
    console.log(`user ${id} disconnected`);
    users.remove(id);

    //deletes user when client disconnets
    io.emit('user-delete', id);
  });
});

//listens to PORT set on top
server.listen(port, host, () => {
  console.log(`Welcome to Akvario @ ${host}:${port}`);
  console.log("PeerServer @" + peerPort);
});

