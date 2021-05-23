import express from 'express';
import {createServer} from 'http';
import {Server} from "socket.io";
import {Test, TestSuite} from './testClasses';
import {proxiTest} from './client/proxiTest.js';
import {colorPickerTest} from "./server/colorPickerTest.js";
import {backendSpinnerTest} from "./server/backendSpinnerTest.js";

let client; // Client ids to choose which test client is client 1
const port = 3205;  // Test Server Port
const app = express();
const resultObject = {}; // All results are stored here
export const test = new Test(); // New test class
const io = new Server(HTTPServer); // Socket.io server
const HTTPServer = createServer(app);
const testSuite = new TestSuite('AkvarioEventTest'); // Akvario Event test

const obj = {
    "moved": {top: 634, left: 781},
    "turned": 0.5, // number
    "disconnect": undefined, // No Data
    "start-spinner":  undefined,  // userColor array?
    "user-speaking": true, // ispeaking, id / number, number
    "sound-controls": "muted"  // string
    //"new-user-connected": user, //Object?
}

// Webbrowser HTML
app.get('/', (req, res) =>res.send('<h1>Akvario Test Server</h1>'));

// Do all this when a client connects
io.on('connection', (socket) =>{
    client.push(socket.id); 

    socket.on("id", id => {
        if(client[0] === socket.id);
            obj["user-disconnected"] = id;
    });

    // Only Emit testEvents to first client.
    if(client.length >= 2)
        io.to(client[client.length - 2]).emit('test', obj);

    // When server recieves an event from the clients add it to the result object
    socket.onAny(addOutput);

    //socket.on('disconnect', () => simpleID--);
});

const server = app.listen(port, () => console.log(`Ts is running on ${port}`));

function addOutput(event, ...args){
    resultObject[event] = args;
    const resObjArr = Object.keys(resultObject);
    const objArr = Object.keys(obj);

    // If the two objects length are equal, the test is ready
    if(resObjArr.length === objArr.length)
        runAkvarioTests();
}

// Do the test
function runAkvarioTests(){
    io.emit('terminate');
    testSuite.addEventTest(resultObject, object);
    test.addSuite(testSuite);

    server.close();
    console.log("Server test ready!");

    proxiTest();
    colorPickerTest();
    backendSpinnerTest();

    test.test();
}