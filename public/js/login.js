import {login} from "./main.js";

// select a color to avoid login without selecting a color.
let myColor = 'red';
export function setupForm() {
    const nameInputField = document.getElementById('username');
    const nameLabelHTML  = document.querySelector('.name-displayed');

    // Get username if the form auto fills the name.
    let username;
    updateUsername(nameInputField.value);

    // Update username as the user types it in.
    nameInputField.addEventListener('input', nameChanged);

    const form = document.getElementById('FIXME');
    form.addEventListener('submit', e => {
        e.preventDefault();
        login(username, myColor);
    });

    function updateUsername (newName){
        nameLabelHTML.textContent = newName;
        username = newName;
    }

    function nameChanged (){
        updateUsername(this.value);
    }
}

export function addEventHandlers(colorElements) {
    const displayedUser = findDisplayedUser();

    colorElements.forEach(element => element.addEventListener('click', displayUserColor));

    let activeColor;
    function displayUserColor(){
        myColor = this.getAttribute("id");

        if (activeColor) activeColor.classList.remove("color-item-active");

        this.classList.add("color-item-active");
        activeColor = this;

        displayedUser.arrow.style.fill = myColor;
        displayedUser.body.style.backgroundColor = myColor;
    }
}

export function findDisplayedUser(){
    const body = document.querySelector('.body-displayed');
    const arrow = document.querySelector('.arrow-displayed');
    const name = document.querySelector('.name-displayed');
    return {body:body, arrow:arrow, name:name};
}

// Draw the UI for the user.
// Takes the colors to choose from and a function to call on login.
export function displayColors(colors){
    const colorPicker = document.querySelector('.color-picker-items');

    const colorElements = [];
    colors.forEach(color => colorElements.push(createColorItem(color)));

    addEventHandlers(colorElements);

    return colorElements;

    function createColorItem(color){
        const newColor = document.createElement("div");
        newColor.setAttribute("class", "coloritem");
        newColor.setAttribute("id", color);

        newColor.style.backgroundColor = color;

        colorPicker.appendChild(newColor);
        return newColor;
    }
}

export async function drawAllUsers(allUsers){
    const HTMLUserObjects = [];
    for (const user of allUsers){
        HTMLUserObjects.push(drawUser(user));
    }
    return HTMLUserObjects;
}

export function drawUser(user){
    const userHTML = createUserHTML(user);
    document.getElementById("space").appendChild(userHTML);
    return userHTML;

    // Creates a new HTML user object.
    function createUserHTML(user){
        const userTemp = document.getElementById("userTemplate").content;
        const userHTML = document.importNode(userTemp,true);
        const userBody = userHTML.querySelector(".body");
        const userContainer = userHTML.querySelector(".user-container");
        const color = user.color;
        const id    = user.id;

        //Gives the container and the body an id
        userContainer.setAttribute('id', id);
        userContainer.style.top  = user.position.top + "px";
        userContainer.style.left = user.position.left + "px";

        userBody.setAttribute('id', id + '_body');
        userBody.style.transform =`rotate(${user.rotation}rad)`;
        userBody.style.backgroundColor = color;
        userBody.style.fill = color;

        // Update the name from template.
        const text = userHTML.querySelector('.name');
        text.textContent = user.name;
        text.setAttribute('id', id + '_name');

        return userHTML;
    }
}

