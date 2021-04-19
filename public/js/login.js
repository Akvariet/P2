
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
                response => response.json(),    // If the login was successful, parse the response.
                reason   => retry(reason))      // Else, handle make the user try again.
            .then(
                response => enterRoom(response),
                reason =>  retry(reason)
            )
});

// The response contains our username encoded in base64.
function enterRoom(response){
    fetch('/game.html')
}

function retry(reason) {
    // The login attempt was rejected. Try again.
    console.log(reason);
    console.log('The login attempt was rejected by the server. Try again.');
}


