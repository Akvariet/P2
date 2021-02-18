let users = [];
let freeID = [];

function newID(){
  if(freeID.length != 0){
    let id = freeID[0];
    freeID.shift();
    return id;
  }
  return users.length;
}

function deleteID(id){
  const index = findIndexID(users, id);
  console.log(`---${index}---`);
  if(index > -1){
    users.splice(index, 1);
    freeID.push(id);
  }
}

function initUser(id){
  this.name = "";
  this.id = id;
  this.color = [0, 0, 0];
  this.pos = [0, 0];
  this.rad = 0;
  this.generateColors = ()=>{
    for(let i = 0; i < this.color.length; i++)
      this.color[i] = Math.floor(Math.random() * 256);
  }
}

function createUser(id){ 
  users.push(new initUser(id));
  const i = users.length - 1;
  users[i].name = "name";
  users[i].generateColors();

  //generateBody(id);
  return id;
}

function findIndexID(arr, id){
  for(let i = 0; i < arr.length; i++){
    if(arr[i].id == id)
      return i;
  }
  return -1;
}

function showNewProp(i){
  if(i != -1)
    console.log(users[i]);
  else
  console.log("nej");
  
}

function showAll(){
  console.log("--Active IDs--")
  for(let i = 0; i < users.length; i++)
    console.log(users[i].id)
  console.log("--Free IDs--");
  for(let i = 0; i < freeID.length; i++)
    console.log(freeID[i]);
}

module.exports = {
  createUser,
  newID,
  deleteID,
  showNewProp,
  showAll,
  users,
  findIndexID
}