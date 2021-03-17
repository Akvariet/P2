const socket = io({autoConnect: false});

// Array of all users, also contain myself.
const users = [];
let myId = '';
let myName = '';
let myColor = 'rgb(0,0,0)'

connectSocket = () => socket.open();

async function connect() {
    // Fetch and display the available colors.
    const response = await fetch('/colors');
    displayLogin(await response.json());

    // If the available colors change, update the UI.
    socket.on('color-picked', newColors => updateLoginColors(newColors));

    // Log in if the user clicks submit.
    const form = document.getElementById('nameForm');
    form.addEventListener('submit', e => login(e));
}


function login(e) {
    e.preventDefault();
    const input = document.getElementById('username');
    const selectedColor = 'red';

    const name = validateName(input.value);
    const color = validateColor(selectedColor);

    //If the chosen name and color is valid, enter the room.
    if (name && color) enter(name, color);
    else loginError(name, color);
}

function validateName(name) {
    return fetch('/name', {method:'POST', body:name})
           .catch(e => throw e)
           .then(response => response.json());

}

function validateColor(selectedColor) {
    requestColor()
        .catch(e => throw e)
        .then(enter(input.value, myColor));
}

async function requestColor(color) {
    const colors = await fetch('/colors', {method:'POST', body: JSON.stringify(color)})
        .catch(e => throw e)
        .then(response => response.json());
}


function enter(value, myColor) {
    return undefined;
}

function loginError(name, Color) {
    throw 'try again';
}
function displayLogin(colors) {
    throw 'not implemented';
}

function updateLoginColors(colors) {
    throw 'not implemented';
}
