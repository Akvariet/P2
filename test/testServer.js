import express from 'express';
import {createServer} from 'http';
import * as socket_io from "socket.io";
import {Test, TestSuite} from './testClasses.js';
import {proxiTest} from './client/proxiTest.js';
import {colorPickerTest} from "./server/colorPickerTest.js";
import {backendSpinnerTest} from "./server/backendSpinnerTest.js";

let client = []; // Client ids to choose which test client is client 1
const port = 3205;  // Test Server Port
const app = express();

export const test = new Test(); // New test class
const HTTPServer = createServer(app);
const io = new socket_io.Server(HTTPServer); // Socket.io server
const testSuite = new TestSuite('AkvarioEventTest'); // Akvario Event test

const expectedClientEvents = {};
const clientEvents = {
    "moved": {top: 634, left: 781},
    "turned": 0.5, 
    "user-speaking": true, 
    "sound-controls": "muted"  
} 
const resultObject = {}; // All results are stored here

// Webbrowser HTML
app.get('/', (req, res) =>res.send('<h1>Akvario Test Server</h1>'));

// Do all this when a client connects
io.on('connection', (socket) =>{

    console.log("Client Connected!");

    client.push(socket.id); 

    socket.on("id", id => {
        if(client[0] === socket.id){
            console.log("Client 1 Chosen!");
            expectedClientEvents["moved"] = [id, {top: 634, left: 781}];
            expectedClientEvents["turned"] = [id, 0.5];                      
            expectedClientEvents["user-speaking"] = [id, true];    
            //"start-spinner":  "undefined",  // userColor array? PLEASERSERESRA          
            expectedClientEvents["sound-controls"] = [id, "muted"];
            expectedClientEvents["user-disconnected"] = [id];
        }
    });

    // Only Emit testEvents to first client.
    if(client.length >= 2){
        console.log("Test data sent!");
        io.to(client[0]).emit('test', clientEvents);
    }
    
    // When server recieves an event from the clients add it to the result object
    socket.onAny(addOutput);
});

const server = HTTPServer.listen(port, () => console.log(`Ts is running on ${port}`));

function addOutput(event, ...args){
    if(event !== "id"){
        console.log(`Recieved output on ${event}`);

        resultObject[event] = args;

        // Object arrays to compare length
        const resObjArr = Object.keys(resultObject);
        const objArr = Object.keys(expectedClientEvents);

        // Terminate client 1 for user-disconnected event
        if(resObjArr.length === 4)
            io.to(client[0]).emit('terminate', 1);

        // If the two objects length are equal, the test is ready
        if(resObjArr.length === objArr.length){
            setTimeout( () => {

                io.emit('terminate');
                runAkvarioTests();
                
            }, 500);
        }
    }
}

// Do the test
function runAkvarioTests(){
    testSuite.addEventTest(resultObject, expectedClientEvents);
    test.addSuite(testSuite);

    console.log("Result object contains:");
    console.table(resultObject);

    console.log("Server test ready!");

    proxiTest();
    colorPickerTest();
    backendSpinnerTest();

    test.test();
    console.log("Test Completed Successfully!");
    server.close();
}