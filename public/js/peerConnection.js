import { config } from './clientConfig.js';
import {beginProxiChat, proxiChat} from './proxi.js';
import {analyzeVoice} from './voiceAnalysis.js';

// holds connected peers peer object which has the same options as your own peer.
export const peers = {};

// Your microphone audio
export let myStream;

// The peer server that the webbrowser connects to 
const options = config('peerConnection');

// Your peer, this holds all your connection information that the peer server returns.
let peer;

/**
 * @summary Sets up a connection to the peer server
 * @param {HTMLElement} myUser - id of own user
 * @param {object<HTMLElement>} users - object containing user HTML objects
 */
export function peerConnection(myUser, users){

    // Gets your microphone audio
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // The devices the webbrowser gets information from
    const media = {video: false, audio: true};

    getUserMedia(media, stream => {
        myStream = stream;
        const id = myUser.getAttribute('id');

        // connects you to the peer server
        peer = new Peer(id, options);

        // When you get connected to the peer server, do this.
        peer.on('open', () => ConnectToAllUsers(stream, myUser, users));

        // When someone calls you, answer
        peer.on('call', call => {
            call.answer(stream);

            const audio = document.createElement('audio');

            proxiChat(audio, myUser, users[call.peer]);

            //When there is a incoming call adds a stream
            call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
        });

        // If there is a error do this
        peer.on('error', err => console.error(err));

        analyzeVoice(stream, id);
    });
}


function ConnectToAllUsers(stream, myUser, users){
    beginProxiChat(myUser);

    // Connects to all users
    Object.values(users).forEach(user => {
        if(user !== myUser) connectToUser(stream, myUser, user)
    });    
}

// Adds other users audio stream to a audio object so the program can modify their audio
function startRemoteStream(remoteStream, audio){
    audio.srcObject = remoteStream;
    audio.addEventListener('loadedmetadata', () => audio.play());
}

// Calls a user
function connectToUser(stream, myUser, otherUser){
    const id = otherUser.getAttribute('id');
    let call = peer.call(id, stream);

    const audio = document.createElement('audio');
    proxiChat(audio, myUser, otherUser);

    //When there is a incoming call adds a stream
    call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
    call.on('close', () => audio.remove());

    //Stores call in object
    peers[id] = call;
}

export function removePeer(id){
    if (peers[id]) {
        peers[id].close();
        delete peers[id];
    }
}