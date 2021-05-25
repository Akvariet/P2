import * as ioClient from "socket.io-client";
import fetch from 'node-fetch';
let connected = false;
let serverSocket;

// Logs in to the akvario server
login(Math.random(), "red")
    .then(res => {
        // Connect to akvario server
        serverSocket = ioClient.io("http://localhost:3200",{
            auth: {
                token: res.cid
            }
        });
        TsSocket.emit("id", res.id);
        // When it is connected to the akvario server
        serverSocket.on("connected", () => {
            connected = true;
            serverSocket.emit("test")

            // On every event recieved from the akvario emit, send it to the test server.
            serverSocket.onAny((evt,...args) => TsSocket.emit(evt,...args));
        });
    });

// Connect to test server
const TsSocket = ioClient.io("http://localhost:3205");

// When test event received from test server do this
TsSocket.on("test", data => {
    // wait to do anything, to when client is connected to akvario server
    const waitOnConnection = setInterval(() => {
        if (connected){
            clearInterval(waitOnConnection);

            // emit everything from test server to server
            Object.keys(data).forEach(evt =>{
                serverSocket.emit(evt, data[evt]);
            })
        }
    },50);
});

// When a terminate event is received, terminate.
TsSocket.on("terminate", terminate);

// Login function to akvario server.
async function login(name, color){
    return fetch('http://localhost:3200/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        // The request contains the name and color selected by the player.
        body: JSON.stringify({
            name: name,
            color: color,
        })
    })
        .then(res => res.json())
        .catch(() => undefined); //...Otherwise it should fail.
}

// Terminate depending on which client is required to terminate
function terminate(client) {
    switch(client){
        default: serverSocket.emit("stop"); 
        case 1: process.exit(0); 
    }  
}