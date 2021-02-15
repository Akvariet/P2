const userID = createUser();
const user = document.getElementById(userID);

for(let i = 0; i < 6; i++)
  createUser();


move(user);

window.addEventListener("mousemove", function (e) {
  const user = document.getElementById(userID);
  const space = document.getElementById("space");
  let mouseX = e.clientX - space.offsetLeft;
  let mouseY = e.clientY - space.offsetTop;
  let userX = user.offsetTop - mouseY + 35;
  let userY = user.offsetLeft - mouseX + 35;
  let angle = -1 * Math.atan2(userY, userX);
  
  user.style.transform = "rotate(" + angle + "rad)";
}, false);
