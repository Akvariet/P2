import {v4 as uuidv4} from 'uuid';

// users is an associative array containing all users with their credential id being the key.
export const users = {};

const gameID = {
    _current: 0,
    next () { return this._current++; }
}

export function get(cid){
    if (users.hasOwnProperty(cid))
        return users[cid];
    else return undefined;
}

// Takes a name and a color and attempts to create a new user. If the name or the color is invalid, it returns undefined.
export function create(name, color){
    if (!(validateName(name) && validateColor(color))) return undefined;

    const cid = uuidv4();
    users[cid] = {
        gameID: gameID.next(),
        name: name,
        color: color,
    }
}

export function remove(cid){
    users.delete(cid);
}

// If the name is available, return true, else return false.
function validateName(name){
    for (const id of users) {
        if (get(id).name === name)
            return false;
    }
    return true;
}

// Dummy function.
function validateColor(color){
    return true;
}