
const colorSelector = document.querySelector('.color-picker-items');
const inputField = document.getElementById('username');
const nameTag = document.getElementById('0_name');

const displayedUser = {
    body : document.querySelector('.body-displayed'),
    arrow: document.querySelector('.arrow-displayed'),
    name : document.querySelector('.name-displayed')
}

const colorPicker = {
    previewColors: ['red', 'brown', 'orange','pink', 'yellow', 'green', 'blue', 'magenta'],
    selectedColor: undefined,
    activeColorPreview: undefined,
};
colorPicker.selectedColor = colorPicker.previewColors[0];


//When the user enters their name, the name tag should update in real time.
inputField.addEventListener('input',
    () => nameTag.textContent = inputField.value);

// Render the available colors in the preview.
colorPicker.previewColors.forEach(color => {
    // Create a new color element.
    const newColor = document.createElement("div");
    newColor.setAttribute("class", "coloritem");
    newColor.setAttribute("id", color);
    newColor.style.backgroundColor = color;

    // When the user clicks the color it should update the user preview.
    newColor.addEventListener('click', e => {
        colorPicker.selectedColor = newColor.getAttribute("id");

        //If a color is active remove this and set the chosen color to be the active color.
        if (colorPicker.activeColorPreview)
            colorPicker.activeColorPreview
                .classList.remove("color-item-active");

        newColor.classList.add("color-item-active");
        colorPicker.activeColorPreview = newColor;

        //Change the user color to the chosen.
        displayedUser.arrow.style.fill = color;
        displayedUser.body.style.backgroundColor = color;
    });

    colorSelector.appendChild(newColor);
});

// When the user submits the form the program attempts to log in.
document.getElementById('user-form')
    .addEventListener('submit', e => {
        e.preventDefault();

        const name  = inputField.value;
        const color = colorPicker.selectedColor;

        // Send a login request to the server.
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            // The request contains the name and color selected by the player.
            body: JSON.stringify({
                name,
                color
            })
        })
        .then(
            response => response.json(),                      // If the login was successful, parse the response.
            reason   => retry(reason, FailMessageLogin))      // Else, handle make the user try again.
        .then(
            response => enterRoom(response),
            reason =>  retry(reason, FailMessageLogin)
        )
});

// The response contains our username encoded in base64.
function enterRoom(response){
    //Remove all HTML related to the login screen, from the users page
    document.getElementById('login-form').remove();

    //Starts creating the HTML game environment
    //Creates the space the users will be able to move around in
    const space = document.createElement('div');
    space.setAttribute('id','space');

    //Creates the spinner for the spinner game
    const spinner = document.createElement('div');
    spinner.setAttribute('class', 'spinner');
    spinner.innerHTML = `<svg id = "spinner"
                 xmlns="http://www.w3.org/2000/svg"
                 width="93.436px"
                 height="65.132px">
                <path
                        d="M 34.803252,65.13249 C 15.581947,65.13249 0,50.552086 0,32.566248 0,14.580406 15.581947,4.8542449e-7 34.803252,0 c 16.915728,4.8542449e-7 50.208497,25.257473 57.95199,31.316697 0.907946,0.710463 0.906961,1.878831 -0.0021,2.58823 C 85.005598,39.950273 51.717508,65.13249 34.803371,65.13249 Z"
                />
            </svg>`;
    space.appendChild(spinner);

    //Adds the space with the spinner to the empty HTML side
    document.body.append(space);

    //Creates the pop up settings menu for the users sound and microphone
    const menuPopUp = document.createElement('div');
    menuPopUp.setAttribute('class', 'menuPopUp');
    menuPopUp.setAttribute('id', 'menuPopUp');
    menuPopUp.innerHTML = `<img type="image" id="menuBody" alt="menuBody" src="resources/menuBody.svg">
        <input type="image" class="microphone" alt="microphoneIcon" id="microphone" src="resources/mic-fill.svg">
        <input type="image" class="speakers" alt="speakeersIcon" id="speakers" src="resources/volume-up-fill.svg">`;

    //Adds the users pop up menu to the HTML
    document.body.append(menuPopUp);

    //SIMONS STUFF
    awake(response.id, response.cid, response.users);
}

function retry(reason) {
    // The login attempt was rejected. Try again.
    console.log(reason);
    console.log('The login attempt was rejected by the server. Try again.');
}


