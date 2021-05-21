import * as connection from './connection.js';

export const mousePosition = {
    x: 0,
    y: 0
}

/**
 * @summary Enables the user to move their own avatar.
 * */
export function enableInteraction(myUser) {
    const userBody = myUser.querySelector('.body-display');
    const arrow = myUser.querySelector(".arrow");

    let userPosX = 0, userPosY = 0, mousePosX = 0, mousePosY = 0;

    userBody.addEventListener('mousedown', dragMouseDown);
    arrow.addEventListener('mousedown', dragMouseDown);
    document.addEventListener('mousemove', lookAtMouse);

    function dragMouseDown(e) {
        e.preventDefault();

        mousePosX = mousePosition.x;
        mousePosY = mousePosition.y;
        document.addEventListener('cameramove', userDrag)
        document.addEventListener('mouseup', closeDragUser);
        document.addEventListener('mousemove', userDrag);

        userBody.style.cursor = "grabbing";
        arrow.style.cursor = "grabbing";
    }

    function userDrag(e) {
        e.preventDefault();

        userPosX = mousePosX - mousePosition.x;
        userPosY = mousePosY - mousePosition.y;
        mousePosX = mousePosition.x;
        mousePosY = mousePosition.y;

        const position = {
            top : (myUser.offsetTop  - userPosY),
            left: (myUser.offsetLeft - userPosX)
        }

        connection.updateData('moved', position);
        move(myUser, position);
    }

    function closeDragUser() {
        document.removeEventListener('cameramove', userDrag)
        document.removeEventListener('mouseup', closeDragUser);
        document.removeEventListener('mousemove', userDrag);
        userBody.style.cursor = "grab";
        arrow.style.cursor = "grab";
    }

    const space = document.getElementById('space');
    // User rotates when the mouse moves.
    function lookAtMouse(e){
        // Updates the mouse pos relative to the space div.
        mousePosition.x = e.clientX - space.offsetLeft;
        mousePosition.y = e.clientY - space.offsetTop;

        // Updates user pos from middle.
        let userX = myUser.offsetTop  - mousePosition.y + (115/2);
        let userY = myUser.offsetLeft - mousePosition.x + ((115+98)/2);

        // Calculate user rotation.
        let rotation = -1 * Math.atan2(userY, userX);

        connection.updateData('turned', rotation);
        turn(myUser, rotation);
    }
}

/** @summary Moves a user to a given location.
 * @param {HTMLElement} user - The user which should be moved.
 * @param {object} position - Position which the user should be moved to. */
export function move(user, position){
    user.style.top  = position.top + "px";
    user.style.left = position.left + "px";

    user.dispatchEvent(new CustomEvent('moved', {detail:position}));
}

/** @summary Turns a user to a given rotation.
 * @param {HTMLElement} user - The user which should be turned.
 * @param {object} rotation - Rotation which the user should be turned to. */
export function turn(user, rotation){
    user.querySelector('.body')
        .style.transform =`rotate(${rotation}rad)`;

    user.dispatchEvent(new CustomEvent('turned', {detail:rotation}));
}

/** @summary Draws a user on the page..
 * @param {object} user - Object holding data about the user which was received from the server. */
export function drawUser(user){
    //Gets the users HTML
    const userHTML = createUserHTML(user);
    //Adds the users html to the game space on the HTML page
    document.getElementById("space").appendChild(userHTML);
    return userHTML;

    // Creates a new HTML user object
    function createUserHTML(user){
        //Creates a container to store all user related html in
        const userContainer = document.createElement('div');
        userContainer.setAttribute('class','user-container');

        //Creates an the users body and adds it to the userContainer
        const userBody = document.createElement('div');
        userBody.setAttribute('class','body');
        userBody.innerHTML = `<svg
                    class="arrow"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 11.328031 13.449599"
                    height="20px"
                    width="20px">
                <g transform="translate(-91.411618,-71.178162)">
                    <g><path d="m 345.7462,274.54091 c 0.82399,3.92069 1.4126,7.88738 1.7626,11.87874 0.4234,4.82846 0.42341,12.70724 10e-6,17.5357 -0.31671,3.6118 -0.82884,7.20385 -1.53415,10.76031 -0.92943,4.68658 1.30847,6.46831 5.44756,4.07875 l 8.78623,-5.07241 a 226183.95,226183.95 149.99924 0 0 15.78977,-9.11651 l 9.67765,-5.58809 a 5.2634256,5.2634256 89.998346 0 0 -2.6e-4,-9.11639 l -9.91419,-5.7239 a 1153838.2,1153838.2 29.999328 0 0 -15.31587,-8.84238 l -8.94831,-5.16608 c -4.47177,-2.58166 -6.81263,-0.67902 -5.75104,4.37226 z" transform="scale(0.26458333)"/>
                    </g>
                </g>
            </svg>`;
        userContainer.appendChild(userBody);

        const bodyDisplay = document.createElement('div');
        bodyDisplay.setAttribute('class', 'body-display');
        userContainer.appendChild(bodyDisplay);

        //Crates a text field for the users name and adds it to the userContainer
        const userName = document.createElement('h3');
        userName.setAttribute('class', 'name');
        userContainer.appendChild(userName);

        //Gets the users color and id
        const color = user.color;
        const id    = user.gameID;

        //Gives the container an id  position
        userContainer.setAttribute('id', id);
        userContainer.style.top  = user.position.top + "px";
        userContainer.style.left = user.position.left + "px";

        //Gives the user body an id, color and sets the rotate
        userBody.setAttribute('id', id + '_body');
        userBody.style.transform =`rotate(${user.rotation}rad)`;
        userBody.style.backgroundColor = color;
        userBody.style.fill = color;

        //Adds the users name to the username text field
        userName.textContent = user.name;
        userName.setAttribute('id', id + '_name');

        return userContainer;
    }
}