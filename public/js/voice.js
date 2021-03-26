const peerOptions = { host: 'localhost', port: 3201, };

export const peers = {}; 

export function handlePeerConnections(myId, users){
    
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const media = {video: false, audio:true};
    const peer  = new Peer(myId, peerOptions);

    getUserMedia(media, streamVoice);
    peer.on('open', myId => console.log("Connected to PeerJS Server with: " + myId));

    function streamVoice(stream){
        peer.on('call', call =>{console.log("call")
    
            call.answer(stream);
    
            const audio = document.createElement('audio');
            call.on('stream', remoteStream=>{
                startRemoteStream(audio, remoteStream);
            });
        });
    
        Object.values(users).forEach(user=>{ 
            if(myId != user.id)
            connectToNewUser(user.id, stream)
        });
    }

    function startRemoteStream(audio, remoteStream){
        audio.srcObject = remoteStream;
        audio.addEventListener('loadedmetadata', playRemoteStream);
    
        function playRemoteStream(){ audio.play(); }
    }
    
    function connectToNewUser(newUserID, stream){

        const call = peer.call(newUserID, stream);
        console.log(peer)


        const audio = document.createElement('audio');
        call.on('stream', remoteStream=>{
            startRemoteStream(audio, remoteStream);
        });
    
        call.on('close', removeRemoteStream);
    
        peers[newUserID] = call;

        function removeRemoteStream(){
            audio.remove();
        }
    }
}