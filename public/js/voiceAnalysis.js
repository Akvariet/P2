import {connection} from "./ClientConnection.js";

export function analyzeVoice(stream) {
    let newAnalysis;
    let speaking = false;
    const userElement = document.getElementById(connection.myID + '_body');

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

    // A function that returns the larges element in array
    let max = (array) => Math.max(...array);

    // sets the range of sounds that we want to get. sounds < -40 is 0 in the data array, and sounds > -10 is 255 (max value)
    analyser.maxDecibels = -10;
    analyser.minDecibels = -50;

    function analyse() {
        //run this function before next repaint
        // Using setTimeout to avoid the browser not running the code when the tab is not in focus.
        // The timout can be adjusted.
        newAnalysis = setTimeout(analyse, 25);

        // Gets the sound data of the analyser and puts it into the dataArray
        analyser.getByteFrequencyData(dataArray);

        //find the highest value in the data array
        let max_data = max(dataArray);

        //If there is a sound in the range
        if (max_data){
            if (speaking === false){
                speaking = true;
                userElement.classList.add('speaking'); // So the user can see that he/she is speaking
                connection.emit("user-speaking", speaking, connection.myID);
            }
        }
        else if (speaking === true) {
            speaking = false;
            userElement.classList.remove('speaking'); // So the user can see that he/she stopped speaking
            connection.emit("user-speaking", speaking, connection.myID);
        }
    }
    analyse();
}

export function displayUserSpeak(speaking, id) {
    const userElement = document.getElementById(id + '_body');

    //If the user started speaking, add the class, if the user stopped speaking, remove the class.
    if (speaking) userElement.classList.add('speaking');
    else userElement.classList.remove('speaking');
}
