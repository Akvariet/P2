import {startSpinner} from './ClientConnection.js';
import {peers} from './voice.js';

export function moveUser(id, position){
    const containerElement = document.getElementById(id);

    const userMoved = new CustomEvent('moved', {detail: position});
    containerElement.dispatchEvent(userMoved);

    containerElement.style.top  = position.top + "px";
    containerElement.style.left = position.left + "px";
}

export function turnUser(id, rotation){
    const user = document.getElementById(id + '_body');
    user.style.transform =`rotate(${rotation}rad)`;
}

export function removeDeadUser(id){
    const userElement = document.getElementById(id);
    if (userElement !== null)
        userElement.remove()

    //Close peer connection
    if (peers[id]) {
        peers[id].close();
        delete peers[id];
    }
}


export function makeInteractable(id){
    const containerElement = document.getElementById(id);
    const userElement = document.getElementById(id + '_body');

    userMove();
    userRotate();
    clickSpinner();
    return containerElement;

    // Enables the user to move around.
    function userMove() {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        userElement.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragUser;
            document.onmousemove = userDrag;
        }

        function userDrag(e) {
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const top  = (containerElement.offsetTop  - pos2);
            const left = (containerElement.offsetLeft - pos1);

            containerElement.style.top  = top + "px";
            containerElement.style.left = left + "px";

            const userMoved = new CustomEvent('moved', {detail: {top:top, left:left}});
            containerElement.dispatchEvent(userMoved);
        }

        function closeDragUser() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    // Enables the user to rotate
    function userRotate(){
        // User rotates when the mouse moves
        window.addEventListener("mousemove", e => lookAtMouse(e));

        function lookAtMouse(e){
            // Updates the mouse pos relative to the space div.
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            // Updates user pos from middle.
            let userX = containerElement.offsetTop - mouseY + (115/2);
            let userY = containerElement.offsetLeft - mouseX + ((115+98)/2);

            // Calculate user rotation.
            let rotation = -1 * Math.atan2(userY, userX);

            // Applies the rotation to the user.
            userElement.style.transform = "rotate(" + rotation + "rad)";

            const userRotated = new CustomEvent('turned', {detail: rotation});
            containerElement.dispatchEvent(userRotated);
        }
    }

    // Enables the user to press on the spinner
    function clickSpinner() {

        // spinner element and the spinners style
        const spinnerElement = document.getElementById('spinner');
        const spinnerDiv = document.querySelector('.spinner');
        const spinnerRot = getComputedStyle(spinnerDiv);

        // when someone clicks the spinner
        spinnerElement.addEventListener('click', () => {
            if (spinnerRot.transform === 'matrix(1, 0, 0, 1, 0, 0)') { // is the spinner in the starting position?
                startSpinner();
            }
        });
    }
}
