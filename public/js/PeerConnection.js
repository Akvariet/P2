import { config } from './clientConfig.js';
//import {beginProxiChat, proxiChat} from './proxi.js';
//import {analyzeVoice} from './voiceAnalysis.js';


// holds connected peers peer object which has the same options as your own peer.
export const peers = {};

// Your micrphone audio
export let myStream;

// The peer server that the webbrowser connects to 
const options = config('peerConnection');

// Your peer, this holds all your connection information that the peer server returns.
let peer;

/**
 * @summary Sets up a connection to the peer server
 * @param {string} id - id of own user
 * @param {object} users - object containing user HTML objects
 */
export function peerConnection(id, users){

    // Gets your microphone audio
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // The devices the webbrowser gets information from
    const media = {video: false, audio: true};

    getUserMedia(media, stream => streamVoice(stream, users, id));
}

function streamVoice(stream, users, id){
    myStream = stream;

    // connects you to the peer server
    peer = new Peer(id, options);

    // When you get connected to the peer server, do this.
    peer.on('open', id => ConnectToAllUsers(stream, id, users));

    // When someone calls you, do this.
    peer.on('call', call => answerCall(stream, call));

    // If there is a error do this
    peer.on('error', err => console.error(err));

    //analyzeVoice(stream);
}

// Connects to all users in the users object
function ConnectToAllUsers(stream, myID, users){
    //beginProxiChat(myID);

    // Connects to all users
    Object.values(users).forEach(user=>{
        if(myID !== user.gameID) connectToUser(stream, user.gameID)
    });    
}

// Answers call 
function answerCall(stream, call){
    call.answer(stream);

    const audio = document.createElement('audio');

    //proxiChat(audio, call.peer);

    //When there is a incoming call adds a stream
    call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
}

// Adds other users audio stream to a audio object so the program can modify their audio 
function startRemoteStream(remoteStream, audio){
    audio.srcObject = remoteStream;
    audio.addEventListener('loadedmetadata', () => audio.play());
}

// Calls a user 
function connectToUser(stream, newUserID){
    let call = peer.call(newUserID, stream);

    const audio = document.createElement('audio');
    //proxiChat(audio, newUserID);

    //When there is a incoming call adds a stream
    call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
    call.on('close', ()=> audio.remove());

    //Stores call in object
    peers[newUserID] = call;
}

export function removePeer(id){
    if (peers[id]) {
        peers[id].close();
        delete peers[id];
    }
}