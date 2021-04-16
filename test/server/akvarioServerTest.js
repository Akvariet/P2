import {AkvarioServer} from '../../scripts/AkvarioServer.js';
import {startServer} from '../../server.js';
import {TestSuite} from '../testClasses.js';
import {test} from '../AkvarioTest.js';

const testServer = new AkvarioServer()

const HTTPServer = startServer(testServer);
const testSocket = {
    id: 'testSocket',
    silent: false,
    emits: [],

    emit(event,...args){
        const emit = {};
        emit[event] = args;
        this.emits.push(emit);
    },
    broadcast:{
        broadcasts: [],

        emit(event, ...args) {
            const broadcasts = {};
            broadcasts[event] = args;
            this.broadcasts.push(broadcasts);
        }
    },

    on(event, callbackFunc){
        console.log(event);
    }
}

function login(socket, name, color){
    testServer.login(socket, name, color);
    const users = findEmit(socket.emits, 'login-successful')[1];
    const emittedUser = findEmit(socket.broadcast.broadcasts, 'new-user-connected').pop();
    const user = users.pop();
    return color === user.color && color === emittedUser.color && name === user.name && name === emittedUser.name;
    }

function move(socket, position){
    testServer.moveUser(socket, position);
    return findEmit(socket.broadcast.broadcasts, 'moved')[1];
}

function turn(socket, position){
    testServer.rotateUser(socket, position);
    return findEmit(socket.broadcast.broadcasts, 'turned')[1];
}

// Finds the latest emit of given event.
function findEmit(a, event){
    for (let i = a.length-1; i >= 0; i--) {
        if (a[i].hasOwnProperty(event)){
            return a[i][event];
        }
    }
}

const testSuite = new TestSuite('akvarioServer.js')

// _____Test login_____
// Test that login emits two events: login-successful or login-rejected and new-user-connected.
testSuite.addFunctionTest(login, [[testSocket, 'Simon', 'red']],[true]);

// Test that the server returns valid color.

// Test that the server returns valid name.

// _____Test move and turn_____
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


export function akvarioServerTest(){
    test.addTestSuite(testSuite)
    HTTPServer.close();
}