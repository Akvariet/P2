import express from 'express';
const app = express();
import {createServer} from 'http';
const HTTPServer = createServer(app);
import {Server} from "socket.io";

const port = 3205;
const io = new Server(HTTPServer);

let client;

app.get('/', (req, res) =>res.send('Hello World!'));

io.on('connection', (socket) =>{
    client.push(socket.id);
    socket.emit('test', object);
    socket.onAny(validate);

    //socket.on('disconnect', () => simpleID--);
});

app.listen(port, () => console.log(`Server is running on ${port}`));

function validate(event, ...args){
    switch(event){
        case "moved": break;
        case "turned": break;
        case "disconnect": break;
        case "start-spinner": break;
        case "user-speaking": break;
        case "sound-controls": break;
        case "user-disconnected": break;
        case "new-user-connected": break;
    }
}