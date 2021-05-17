import {AkvarioServer} from '../../scripts/AkvarioServer.js';
import {TestSuite} from '../testClasses.js';
import {test} from '../AkvarioTest.js';
import {createServer} from 'http';
import express from 'express';
import * as ioClient from 'socket.io-client'
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import {router} from '../../scripts/routes.js';

const server = express();
server.use(bodyParser.json());
server.use(express.static('public'));
server.use(router);

const HTTPServer = createServer(server)

const testServer = new AkvarioServer(HTTPServer)

let testSocket;

HTTPServer.listen(3200)

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
        .then(res => {

            testSocket = ioClient.io({
                auth: {
                    token: res.cid
                }
            })

            return res; // If the name is correct, the test is passed.
        })
        .catch(reason => undefined); //...Otherwise it should fail.
}

// Perform login test.
async function loginTest(name, color) {
    const res = await login(name, color);
    return res ? res.users[res.id].name === name : false;
}

async function socketTest(name, color){
    const res = await login(name, color);
    testSocket = ioClient.io({auth:{token: res.cid}})
    testSocket.emit('test');
    return true;
}

const testSuite = new TestSuite('akvarioServer.js')

// _____Test login_____
// Test that login emits two events: login-successful or login-rejected and new-user-connected.
testSuite.addFunctionTest(loginTest,['name', 'red'],true);
testSuite.addFunctionTest(loginTest,['name', 'red'],false);

// _____Test socket connection_____
//testSuite.addFunctionTest(socketTest, ['MyUserName', 'yellow'], true);

// _____Test move and turn_____

/*
testSuite.addFunctionTest(move, [
    [testSocket, {top:39, left:83}],
    [testSocket, {top:584, left:1337}],
    [testSocket, {top:29383, left:2348327}]],
    [
        {top:39, left:83},
        {top:584, left:1337},
        {top:29383, left:2348327},
    ]);

testSuite.addFunctionTest(turn, [
        [testSocket, 1],
        [testSocket, 5.374],
        [testSocket, 19]],
    [
        1,
        5.374,
        19,
    ]);
*/

export function akvarioServerTest(){
    test.addSuite(testSuite)
}