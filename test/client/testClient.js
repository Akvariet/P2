import * as ioClient from "socket.io-client";
import fetch from 'node-fetch';
const TsPort = 3205;
let connected = false;
let serverSocket;

const TsSocket = ioClient.io("http://localhost:" + TsPort);

function terminate() {
    serverSocket.emit("stop");
    process.exit(0);
}

TsSocket.on("test",data => {
    const waitOnConnection = setInterval(() => {
        if (connected){
            clearInterval(waitOnConnection);
            Object.keys(data).forEach(evt =>{
                serverSocket.emit(evt, data[evt])
            })
        }
    },50);
});
TsSocket.on("terminate", () => terminate());

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

login(Math.random(), "red")
    .then(res => {
        let serverSocket = ioClient.io("http://localhost:3200",{
            auth: {
                token: res.cid
            }
        });
        TsSocket.emit("id", res.id);
        serverSocket.on("connection",() => {
            connected = true;
            serverSocket.emit("test")
            serverSocket.onAny((evt,...args) => TsSocket.emit(evt,...args));
        });
    });
