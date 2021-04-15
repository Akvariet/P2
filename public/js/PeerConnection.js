import {beginProxiChat, proxiChat} from './proxi.js';
import {analyzeVoice} from './voiceAnalysis.js';

export const peers = {};
export let myStream;

export class PeerVoiceConnection{
    getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    media = {video: false, audio: true};
    peer;
    myID;

    constructor(options, id, users){
        this.myID = id;
        this.getUserMedia(this.media, stream => this.streamVoice(stream, options, users));
    }

    streamVoice(stream, options, users){
        myStream = stream;
        this.peer = new Peer(this.myID, options);
        this.peer.on('open', id => this.ConnectToAllUsers(stream, id, users));
        this.peer.on('call', call => this.answerCall(stream, call));
        this.peer.on('error', err => console.error(err));

        analyzeVoice(stream);
    }

    //calls every user already connected to server
    ConnectToAllUsers(stream, myID, users){
        beginProxiChat(myID);
             
        Object.values(users).forEach(user=>{
            if(myID !== user.id) this.connectToUser(stream, user.id)
        });    
    }

    answerCall(stream, call){
        call.answer(stream);

        const audio = document.createElement('audio');

        proxiChat(audio, call.peer);

        //when there is a incoming call adds a stream
        call.on('stream', remoteStream => this.startRemoteStream(remoteStream, audio));
    }


    startRemoteStream(remoteStream, audio){
        audio.srcObject = remoteStream;
        audio.addEventListener('loadedmetadata', () => audio.play());
    }

    //calls a user
    connectToUser(stream, newUserID){
        let call = this.peer.call(newUserID, stream);

        const audio = document.createElement('audio');
        proxiChat(audio, newUserID);

        //when there is a incoming call adds a stream
        call.on('stream', remoteStream => this.startRemoteStream(remoteStream, audio));
        call.on('close', ()=> audio.remove());

        //stores call in object
        peers[newUserID] = call;
    }
}