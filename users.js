import {v4 as uuidv4} from 'uuid';

// users is an associative array containing all users with their credential id being the key.
export const users = {};

const gameID = {
    _current: 0,
    next () { return uuidv4(); }
}

export function exportUsers(){
    const allUsers = {};
    for (const userKey in users) {
        const id = users[userKey].gameID;

        allUsers[id] = users[userKey];
    }
    return allUsers;
}

export function changeID(newID, oldID){
    if(users.hasOwnProperty(oldID)){
        Object.assign(users, {[newID]:users[oldID]})
        delete users[oldID];
    }
    else console.log('User did not exist')
}

export function get(cid){
    if (users.hasOwnProperty(cid))
        return users[cid];
    else return undefined;
}

export function positions(){
    const result = {};
    Object.keys(users)
        .forEach(id => result[users[id].gameID] = users[id].position);
    return result;
}
export function colors(){
    const result = {};
    Object.keys(users)
        .forEach(id => result[users[id].gameID] = users[id].color);
    return result;
}

// Takes a name and a color and attempts to create a new user. If the name or the color is invalid, it returns undefined.
export function create(name, color){
    if (!(validateName(name) || !validateColor(color))) return undefined;

    const cid = uuidv4();
    const id = gameID.next();

    users[cid] = {
        gameID: id,
        name: name,
        color: color,
        position: {top: 0, left: 0},
        rotation: 1
    };

    return cid;
}

export function remove(cid){
    if (users.hasOwnProperty(cid)){
        delete users[cid];
        console.log('user ' + cid + ' removed');
    }
    else console.log('user ' + cid + ' did not exist!');
}

// If the name is available, return true, else return false.
function validateName(name){
    for (const id of Object.keys(users)) {
        const user = get(id);
        if (user && user.name === name)
            return false;
    }
    return true;
}

// Dummy function.
function validateColor(color){
    return true;
}