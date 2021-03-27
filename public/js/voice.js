const calls = {};
let myStream;
let myPeer;

export function connectToPeerServer(socket, id, host, port){
    //connect to the peer server with "undefined" ID (generates uuid instead)
    myPeer = new Peer(id, {
        secure: true,
        host:   host || 'audp2p.herokuapp.com',
        port:   port || 443,
    });

    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
        //stream audio
    }).then(stream => {
        myStream = stream;

        //? when somebody sends data then this / already connected users
        myPeer.on('call', call => {
            console.log('call received');
            //? call must be answered or no connection / answers with own audio stream
            call.answer(myStream);

            //creates new audio object
            const audio = document.createElement('audio');
            document.body.append(audio);


            //when receiving old stream add it to audio container
            call.on('stream', userAudioStream => {
                addAudioStream(audio, userAudioStream);
            });
        });
    });

    //when connected to the peer server do this
    myPeer.on('open', id => socket.emit('voice', id));
}

//Make audio object and get new user connection
export function callNewPeer(userId, stream) {
    const call = myPeer.call(userId, stream);
    console.log('calling user ' + userId);

    const audio = document.createElement('audio');

    //when receiving new stream add it to audio container
    call.on('stream', userAudioStream => addAudioStream(audio, userAudioStream));

    //delete audio object
    call.on('close', () => audio.remove());

    // connect id to call
    calls[userId] = call;
}

//add audio object to audio container
function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', ()=> audio.play());
}

