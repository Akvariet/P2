import {updateData, users} from './main.js';

export function analyzeVoice(stream, id) {
    let newAnalysis;
    let speaking = false;
    const userElement = users[id].querySelector('.body');

    //Creating a analyzerNode
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();

    //The analyser node connectes to the audio source between source and destination
    let source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    //Sets the frequency of the fft (Fast Fourier Transform)
    analyser.fftSize = 256;

    // Finds the amount of data points that will be collected
    let bufferLength = analyser.frequencyBinCount;

    // Creates a new array based on the amount of data points and the data type (in this case it is 8-bit unsigned integers)
    let dataArray = new Uint8Array(bufferLength);

    // sets the range of sounds that we want to get. sounds < -40 is 0 in the data array, and sounds > -10 is 255 (max value)
    analyser.maxDecibels = -10;
    analyser.minDecibels = -50;

    function analyse() {
        //run this function before next repaint
        // Using setTimeout to avoid the browser not running the code when the tab is not in focus.
        // The timout can be adjusted.
        newAnalysis = setTimeout(analyse, 25);

        //If there is a sound in the range
        if (analyseIncomingVoice(analyser, dataArray)){
            if (speaking === false){
                speaking = true;
                userElement.classList.add('speaking'); // So the user can see that he/she is speaking
            }
        }
        else if (speaking === true) {
            speaking = false;
            userElement.classList.remove('speaking'); // So the user can see that he/she stopped speaking
        }
        updateData('user-speaking', speaking, id);
    }
    analyse();
}

function analyseIncomingVoice(analyser, dataArray){
    // Gets the sound data of the analyser and puts it into the dataArray
    analyser.getByteFrequencyData(dataArray);

    //find the highest value in the data array
    let max_data = Math.max(...dataArray);

    return Boolean(max_data);
}

export function displayUserSpeak(speaking, id) {
    const userElement = document.getElementById(id + '_body');

    //If the user started speaking, add the class, if the user stopped speaking, remove the class.
    if (speaking) userElement.classList.add('speaking');
    else userElement.classList.remove('speaking');
}
