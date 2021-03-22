

export class UserProperties{
    constructor() {
        this.users = {};
        this.userProperties = {
            position: {},
            rotation: {},
            name:     {},
            color:    {}
        }
    }

    // Returns the user with the given id.
    get = id => {
        if (!this.users.hasOwnProperty(id)) return undefined;

        const properties = {id: id};
        Object.keys(this.userProperties).forEach(prop =>
            properties[prop] = this.userProperties[prop][id]);

        return properties;
    }

    // Adds a user to collection, Returns the id.
    add = (id, name, color, position, rotation) => {
        // Check if it exists already...
        if (this.exists(id))
            console.warn(`user with id ${id} already existed! Did you mean to override?`);

        // ..Otherwise, add it.
        else {
            const properties = this.userProperties;
            const user = this.users[id] = {
                get position() {return properties.position(id)},
                get rotation() {return properties.rotation(id)},
                get name()     {return properties.name(id)},
                get color()    {return properties.color(id)},

                set position(position) {properties.position[id] = position},
                set rotation(rotation) {properties.rotation[id] = rotation},
                set name(name)   {properties.name[id]  = name},
                set color(color) {properties.color[id] = color}
            };

            user.name  = name;
            user.color = color;
            user.position = position;
            user.rotation = rotation;
        }
        return this.get(id);
    }

    get positions() {return this.userProperties.position}
    get rotations() {return this.userProperties.rotation}
    get names()     {return this.userProperties.name}
    get colors()    {return this.userProperties.color}

    // Does the user with the given id exist?
    exists = id => this.users.hasOwnProperty(id);

    // Removes the user with the given id from collection
    remove = id =>{
        if(this.exists(id)){
            Object.keys(this.userProperties).forEach(prop => delete this.userProperties[prop][id]);
            delete this.users[id];
        }

        else console.warn(`user with id ${id} did not exist and could not be deleted!`);
    }

    toJSON = () => {
        const allUsers = [];
        for (const user in this.users){
            allUsers.push(this.get(user));
        }
        return JSON.stringify(allUsers);
    }
}

const allUsers = new UserProperties();
const freeIDs = [];
let previousID = 0;
let nextID = () => ++previousID;
const initialPosition = {top:10, left:10};
const initialRotation = 0;

export function createUser(name, color){
    const id = freeIDs.pop() || nextID();
    return allUsers.add(id, name, color, initialPosition, initialRotation);
}