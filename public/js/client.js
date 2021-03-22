export async function connect(){
    // Get the available colors.
    const colors = await getColors('/colors');
    const displayedUser = findDisplayedUser();

    // Display login form.
    const colorElements = displayColors(colors, displayedUser);

    addEventHandlers(colorElements);
}

function addEventHandlers(colorElements) {
    const displayedUser = findDisplayedUser();
    const form = document.getElementById('FIXME');
    document.getElementById('username')
        .addEventListener('input', updateUsername);

    colorElements.forEach(element => element.addEventListener('click', displayUserColor));

    form.addEventListener('submit', e => {
        e.preventDefault();
        login(username, color);
    });

    let username;
    function updateUsername(){
        displayedUser.name.textContent = this.value;
        username = this.value;
    }

    let activeColor;
    let color;
    function displayUserColor(){
        color = this.getAttribute("id");

        if (activeColor) activeColor.classList.remove("color-item-active");

        this.classList.add("color-item-active");
        activeColor = this;

        displayedUser.arrow.style.fill = color;
        displayedUser.body.style.backgroundColor = color;
    }
}


// Fetches the user colors from the server.
// GET on /url should return an array with the color variants.
function getColors(url){
   return fetchJSON(url)
}

async function fetchJSON(url){
    const res = await fetch(url);
    return await res.json();
}

// Draw the UI for the user.
// Takes the colors to choose from and a function to call on login.
function displayColors(colors){
    const colorPicker = document.querySelector('.color-picker-items');

    const colorElements = [];
    colors.forEach(color => colorElements.push(createColorItem(color)));

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

function findDisplayedUser(){
    const body = document.querySelector('.body-displayed');
    const arrow = document.querySelector('.arrow-displayed');
    const name = document.querySelector('.name-displayed');
    return {body:body, arrow:arrow, name:name};
}

function login(username, color){
    // Request login from server.
    requestLogin(username, color, '/login')
    // Handle rejection.
        .catch(() => console.warn('login Rejected!'))
    // Enter the room.
        .then(user=>enterRoom(user.id));
}

async function requestLogin(username, color, url){
    const o = {username: username, color: color};
    return await postObject(o, url);
}

async function postObject(obj, url){
    return await fetch(url,{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // Handle promise rejected.
}

async function enterRoom(myId){
    // Remove login screen.
    const wrapper = document.querySelector('.login-form-wrapper');
    wrapper.parentNode.removeChild(wrapper);

    // Get the other users from the server.
    const allUsers = await fetchUsers();

    // Draw all users.
    drawAllUsers(allUsers);

    // Make own avatar interactable.
    const myUser = makeInteractable(myId);

    // Handle events
    myUser.addEventListener('moved', userMoved);
    myUser.addEventListener('rotated', userRotated);
}

function makeInteractable(id){
    const containerElement = document.getElementById(id);
    const userElement = document.getElementById(id + '_body');
    const space = document.getElementById("space");

    userMove();
    userRotate();
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

            const userMoved = new CustomEvent('moved', {position: {top:top, left:left}});
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
            let mouseX = e.clientX - space.offsetLeft;
            let mouseY = e.clientY - space.offsetTop;

            // Updates user pos from middle.
            let userX = containerElement.offsetTop - mouseY + (115/2);
            let userY = containerElement.offsetLeft - mouseX + ((115+98)/2);

            // Calculate user rotation.
            let rotation = -1 * Math.atan2(userY, userX);

            // Applies the rotation to the user.
            userElement.style.transform = "rotate(" + rotation + "rad)";

            const userRotated = new CustomEvent('rotated', {rotation: rotation});
            containerElement.dispatchEvent(userRotated);
        }
    }
}

async function drawAllUsers(allUsers){
    const HTMLUserObjects = [];
    for (const user of allUsers){
        HTMLUserObjects.push(drawUser(user));
    }
    return HTMLUserObjects;
}

function drawUser(user){
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

function fetchUsers(){
    return fetchJSON('../users');
}

function userConnected(user){
    // Add user to collection
    // Draw the user.
}

function userMoved(user){
    // Update user position.
    updatePosition();
}

function updatePosition(){
    // Update position.
}

function userRotated(user){
    // Update user rotation.
}

function userDisconnected(user){
    // Remove the user from the collection.
    // Remove the user from HTML.
}



