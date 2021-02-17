let name = "test"; //prompt("Name:");
const userID = createUser(name);
const user = document.getElementById(userID);

move(user);

window.addEventListener("mousemove", function (e) {
  const user = document.getElementById(userID);
  const name = document.getElementById(userID + '_name');
  const space = document.getElementById("space");
  let mouseX = e.clientX - space.offsetLeft;
  let mouseY = e.clientY - space.offsetTop;
  let userX = user.offsetTop - mouseY + 35;
  let userY = user.offsetLeft - mouseX + 35;
  let o = users[userID].rad = -1 * Math.atan2(userY, userX);
  user.style.transform = "rotate(" + o + "rad)";
  name.style.transform = "rotate(" + -1*o + "rad)";
}, false);
