import { config } from './clientConfig.js';
import {beginProxiChat, proxiChat} from './proxi.js';
import {analyzeVoice} from './voiceAnalysis.js';

export const peers = {};
export let myStream;
const options = config('peerConnection');
let peer;

export function peerConnection(id, users){
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const media = {video: false, audio: true};

    getUserMedia(media, stream => streamVoice(stream, users, id));
}

function streamVoice(stream, users, id){
    myStream = stream;
    peer = new Peer(id, options);
    peer.on('open', id => ConnectToAllUsers(stream, id, users));
    peer.on('call', call => answerCall(stream, call));
    peer.on('error', err => console.error(err));

    analyzeVoice(stream);
}

function ConnectToAllUsers(stream, myID, users){
    beginProxiChat(myID);
         
    Object.values(users).forEach(user=>{
        if(myID !== user.id) connectToUser(stream, user.id)
    });    
}

function answerCall(stream, call){
    call.answer(stream);

    const audio = document.createElement('audio');

    proxiChat(audio, call.peer);

    //when there is a incoming call adds a stream
    call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
}

function startRemoteStream(remoteStream, audio){
    audio.srcObject = remoteStream;
    audio.addEventListener('loadedmetadata', () => audio.play());
}

//calls a user
function connectToUser(stream, newUserID){
    let call = peer.call(newUserID, stream);

    const audio = document.createElement('audio');
    proxiChat(audio, newUserID);

    //when there is a incoming call adds a stream
    call.on('stream', remoteStream => startRemoteStream(remoteStream, audio));
    call.on('close', ()=> audio.remove());

    //stores call in object
    peers[newUserID] = call;
}
