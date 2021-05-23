import * as ioClient from "socket.io-client";
import fetch from 'node-fetch';
let connected = false;
let serverSocket;

console.log("testClient.js")

login(Math.random(), "red")
    .then(res => {
        serverSocket = ioClient.io("http://localhost:3200",{
            auth: {
                token: res.cid
            }
        });
        TsSocket.emit("id", res.id);
        serverSocket.on("connected", () => {
            connected = true;
            console.log("Connected to Akvario server");
            serverSocket.emit("test")
            serverSocket.onAny((evt,...args) => {
                console.log(`Emitted event: ${evt} with ${args}`);
                TsSocket.emit(evt,...args)
            });
        });
    });

const TsSocket = ioClient.io("http://localhost:3205");

TsSocket.on("test", data => {
    console.log("test data recieved")
    const waitOnConnection = setInterval(() => {
        if (connected){
            clearInterval(waitOnConnection);
            console.table(data);
            Object.keys(data).forEach(evt =>{
                serverSocket.emit(evt, data[evt]);
            })
        }
    },50);
});
TsSocket.on("terminate", terminate);

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

function terminate(client) {
    switch(client){
        default: serverSocket.emit("stop"); 
        case 1: process.exit(0); 
    }  
}