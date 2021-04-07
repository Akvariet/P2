import {beginProxiChat, proxiChat} from './proxi.js';

//peers contains all connected peers
export const peers = {};

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
        beginProxiChat(myId);

        //calls every user already connected to server
        Object.values(users).forEach(user=>{
            if(myId !== user.id)
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
            if (myId !== user.id)
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


