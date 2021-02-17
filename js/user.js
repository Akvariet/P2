let users = [];
let names =["Liam", "Jan", "Olivia", "Oliver", "Hanne", "Juliet", "Lars", "Bot69"];

function initUser(id){
  this.name = "";
  this.id = id;
  this.color = [0, 0, 0];
  this.pos = [0, 0];
  this.rad = 0;
  this.generateColors = function(){
    for(let i = 0; i < this.color.length; i++)
      this.color[i] = Math.floor(Math.random() * 256);
  }
}

function createUser(name){
  const id = users.length;
  const randomName = Math.floor(Math.random() * names.length);
  
  users.push(new initUser(id));
  users[id].name = name;
  users[id].generateColors();

  generateBody(id);

  return id;
}

function generateBody(id){
  const body = document.createElement("div");
  const arrow = '<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.328031 13.449599" height="20px" width="20px"><g transform="translate(-91.411618,-71.178162)"><g><path d="m 345.7462,274.54091 c 0.82399,3.92069 1.4126,7.88738 1.7626,11.87874 0.4234,4.82846 0.42341,12.70724 10e-6,17.5357 -0.31671,3.6118 -0.82884,7.20385 -1.53415,10.76031 -0.92943,4.68658 1.30847,6.46831 5.44756,4.07875 l 8.78623,-5.07241 a 226183.95,226183.95 149.99924 0 0 15.78977,-9.11651 l 9.67765,-5.58809 a 5.2634256,5.2634256 89.998346 0 0 -2.6e-4,-9.11639 l -9.91419,-5.7239 a 1153838.2,1153838.2 29.999328 0 0 -15.31587,-8.84238 l -8.94831,-5.16608 c -4.47177,-2.58166 -6.81263,-0.67902 -5.75104,4.37226 z" transform="scale(0.26458333)"/></g></g></svg>';

  body.setAttribute('id', `${id}`);
  body.setAttribute('class', 'user');
  body.innerHTML = arrow;

  users[id].pos[1] = body.style.top = Math.floor(Math.random() * (90 - 10) + 10) + "%";
  users[id].pos[0] = body.style.left = Math.floor(Math.random() * (90 - 10) + 10) + "%";
  body.style.backgroundColor = `rgb(${users[id].color[0]},${users[id].color[1]},${users[id].color[2]})`;
  body.style.fill = `rgb(${users[id].color[0]},${users[id].color[1]},${users[id].color[2]})`;
  document.getElementById("space").appendChild(body);
  myName(id);
}

function myName(id){
  const text = document.createElement("h3");
  text.innerHTML = users[id].name
  text.setAttribute('class', 'name');
  text.setAttribute('id', id + '_name');
  document.getElementById(id).appendChild(text);
}

