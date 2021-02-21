/*
Here all users are stored and deleted
freeIDs is ids not being used but has been used.
*/
let users = [];
let freeID = [];



/*return a new id for new users*/
function newID(){

  /*if there is ids free then give one to the new user and delete it from freeID*/
  if(freeID.length != 0){
    let id = freeID[0];
    freeID.shift();
    return id;
  }

  /*if there is no free IDs give the new user the length of users as id */
  return users.length;
}



/*deletes the user who left*/
function deleteID(id){
  const index = findIndexID(users, id);
  console.log(`Deleted user on index: ${index}`);

  if(index > -1){
    users.splice(index, 1);
  }
}



//user template
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



//create new user
function createUser(clientName, id){ 

  //adds a new user from the user template
  users.push(new initUser(id));
  const i = users.length - 1;

  //this should be changed
  users[i].name = clientName;

  //generates colors
  users[i].generateColors();

  //initial position in procentages
  users[i].pos[0] = Math.floor(Math.random() * (90 - 10) + 10);
  users[i].pos[1] = Math.floor(Math.random() * (90 - 10) + 10);

  //generateBody(id);

  //when createUser is done it returns the id that can be used in other places
  return id;
}



//look in /public/js/userClient.js
function findIndexID(arr, id){
  for(let i = 0; i < arr.length; i++){
    if(arr[i].id == id)
      return i;
  }
  return -1;
}



//shows the new user in the server console
function showNewProp(i){
  if(i != -1)
    console.log(users[i]);
  else
  console.log("nej");
}



//shows all the active and free ids 
function showAll(){
  console.log("--Active IDs--")
  for(let i = 0; i < users.length; i++)
    console.log(users[i].id)
}


// exports the functions to be used outside this file
module.exports = {
  createUser,
  newID,
  deleteID,
  showNewProp,
  showAll,
  users,
  findIndexID
}