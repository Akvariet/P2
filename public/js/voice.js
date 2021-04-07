import {options, production} from './clientConfig.js';
import {adjustVolume, getPos} from './proxi.js';
import {connection} from './main.js';

//peers contains all connected peers
export const peers = {};
const audioPlayers = {};
let myId;
let myStream;

//handles all peerjs functions and events
export function handlePeerConnections(id, users) {

    myId = id;

    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const media = {video: false, audio: true};

    //connects to peerjs server
    const peer = new Peer(myId);

    //gets microphone stream
    getUserMedia(media, streamVoice);

    peer.on('open', myId =>{
        console.log("Connected to PeerJS Server with: " + myId)
        beginProxiChat(myId);
        //calls every user already connected to server
        Object.values(users).forEach(user=>{
            if(myId != user.id)
            connectToUser(user.id, myStream)
        });
    });

    function streamVoice(stream) {
        myStream = stream;
        //incoming call event
        peer.on('call', call => {

            //must be answered
            call.answer(stream);

            //when incoming call adds a stream
            const audio = document.createElement('audio');

            proxiChat(audio, call.peer);

            call.on('stream', remoteStream => {
                startRemoteStream(audio, remoteStream);
            });
        });

        //calls every user already connected to server
        Object.values(users).forEach(user => {
            if (myId != user.id)
                connectToUser(user.id, stream)
        });
    }

    //plays remote stream through audio object
    function startRemoteStream(audio, remoteStream) {
        audio.srcObject = remoteStream;
        audio.addEventListener('loadedmetadata', playRemoteStream);

        function playRemoteStream() {
            audio.play();
        }
    }

    function connectToUser(newUserID, stream) {

        //makes call to remote peer
        const call = peer.call(newUserID, stream);

        //when remote peer has answered and added a stream
        const audio = document.createElement('audio');
        proxiChat(audio, newUserID);

        call.on('stream', remoteStream => {
            startRemoteStream(audio, remoteStream);
        });

        call.on('close', removeRemoteStream);

        //stores call in object
        peers[newUserID] = call;

        function removeRemoteStream()
        {
            audio.remove();
        }
    }
}
function beginProxiChat(myID){
    const myElement = document.getElementById(myID);
    myElement.addEventListener('moved', (e)=>{

        for (const audioPlayer in audioPlayers) {
            adjustVolume(audioPlayers[audioPlayer].audio, e.detail, audioPlayers[audioPlayer].position);
        }
    });
}

function proxiChat(audio, userID){

    const userContainer = document.getElementById(userID);
    const myElement = document.getElementById(connection.myID);
    userContainer.append(audio);
    audioPlayers[userID] = {audio: audio, position: getPos(userContainer)};

    userContainer.addEventListener('moved', (e) => {
        const pos1 = getPos(myElement);
        const pos2 = getPos(userContainer);

        audioPlayers[userID].position = pos2;

        adjustVolume(audio, pos1, pos2);
    })
}

