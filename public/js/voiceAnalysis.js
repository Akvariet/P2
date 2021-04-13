import {connection} from "./ClientConnection.js";

const minBuffer = 140;
let drawVisual;

export function analyseVoice(stream) {
    const userElement = document.getElementById(connection.myID + '_body');

    //Creating a analyzerNode
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();
    let source = audioCtx.createMediaStreamSource(stream);
    let speaking = false;

    // Connect the source to be analysed
    source.connect(analyser);
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    let max_data;
    let max = (array) => Math.max(...array);

    function analyse() {
        drawVisual = requestAnimationFrame(analyse);
        analyser.getByteTimeDomainData(dataArray);
        max_data = max(dataArray);

        if (max_data > minBuffer){
            if (speaking === false){
                speaking = true;
                userElement.classList.add('speaking');
                connection.emit("user-speaking", speaking, connection.myID);
            }
        }
        else if (speaking === true) {
            speaking = false;
            userElement.classList.remove('speaking');
            connection.emit("user-speaking", speaking, connection.myID);
        }
    }
    analyse();
}

export function displayUserSpeak(speaking, id) {
    console.log(id);
    const userElement = document.getElementById(id + '_body');x

    if (speaking) userElement.classList.add('speaking');
    else userElement.classList.remove('speaking');
}
