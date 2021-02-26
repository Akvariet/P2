export class UserCollection{
    constructor() {
        this.users = {};
    }

    // Returns the user with the given id.
    get = id => this.users[`${id}`];

    //Creates an entirely new user and adds it to the collection.
    make = (id, name, color, pos, rad) =>
        this.add({
            id: id,
            name: '' || name,
            color: `rgb(0,0,0)` || color,
            pos: { top: 0, left: 0 } || pos,
            rad : 0 || rad
        });

    // Returns the positions of all users in an object.
    positions = () =>{
        const pos = {};
        Object.keys(this.users).forEach(id => pos[id] = this.get(id).pos);
        return pos;
    }

    // Adds a user to collection, Returns the user.
    add = user => {
        if(this.get(user) !== undefined)
            console.warn(`user with id ${user.id} already existed! Did you mean to override?`);

        this.users[`${user.id}`] = user;
        return user;
    }

    // Removes the user with the given id from collection
    remove = id => {
        if(this.get(id) !== undefined)
            delete this.users[`${id}`];}
}
