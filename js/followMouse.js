/*e = e || window.event is browser compatibility  */

function move(user) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let myPos;

  user.onmousedown = dragMouseDown;

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
    users[0].pos[0] = (user.offsetTop - pos2);
    users[0].pos[1] = (user.offsetLeft - pos1);

    user.style.top = users[0].pos[0] + "px";
    user.style.left = users[0].pos[1] + "px";
    myPos = JSON.stringify(users[0].pos);
    console.log(myPos)
  }

  function closeDragUser() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
