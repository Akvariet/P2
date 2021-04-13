import {connection} from "./ClientConnection.js";

const minBuffer = 140;

export function analyzeVoice(stream) {
    let drawVisual;
    let speaking = false;
    const userElement = document.getElementById(connection.myID + '_body');

    //Creating a analyzerNode
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();

    //The analyser node connectes to the audio source between source and destination
    let source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    //Sets the frequency of the fft (Fast Fourier Transform)
    analyser.fftSize = 2048;

    // Finds the amount of data points that will be collected
    let bufferLength = analyser.frequencyBinCount;

    // Creates a new array based on the amount of data points and the data type (in this case it is 8-bit unsigned integers)
    let dataArray = new Uint8Array(bufferLength);

    // A function that returns the larges element in array
    let max = (array) => Math.max(...array);

    function analyse() {
        drawVisual = requestAnimationFrame(analyse);

        // Gets the waveform data of the analyser and puts it into the dataArray
        analyser.getByteTimeDomainData(dataArray);

        let max_data = max(dataArray);

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
    const userElement = document.getElementById(id + '_body');

    if (speaking) userElement.classList.add('speaking');
    else userElement.classList.remove('speaking');
}
