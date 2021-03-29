import {
    displayColors,
    drawAllUsers,
    setupForm,
} from "./login.js";

import { makeInteractable } from './interaction.js'

// Display both the form ans the color picker.
// attemptLogin is called when the user clicks submit on the form.
export function displayLoginScreen() {
    // TODO: Catch errors on get /colors
    renderColorPicker();

    // Set up the form to handle user input.
    setupForm();
}

function renderColorPicker() {
    // Show the available colors on the UI.
    displayColors();
}

export function enterRoom(myId, allUsers){
    // Remove login screen.
    const wrapper = document.querySelector('.login-form-wrapper');
    wrapper.parentNode.removeChild(wrapper);

    // Draw all users.
    //TODO: Handle errors.
    drawAllUsers(allUsers);

    // Make own avatar interactable.
    return makeInteractable(myId);
}


