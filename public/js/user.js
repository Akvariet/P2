export class UserCollection{

    // Returns the user with the given id.
    get = id => this[`${id}`];

    /* Creates an entirely new user and adds it to the collection

       color is css color (rgb or hex).
       pos is css pos ({top,left}).
       rad is rotation in radians.                              */
    make = (id, name, color, pos, rad) =>
        this.add({
            id: id,
            name: '' || name,
            color: `rgb(0,0,0)` || color,
            pos: { top: 0, left: 0 } || pos,
            rad : 0 || rad
        });


    // Adds a user to collection, Returns the user.
    add = user => {
        if(this.get(user) !== undefined)
            console.warn(`user with id ${user.id} already existed! Did you mean to override?`);

        this[`${user.id}`] = user;
        return user;
    }

    // Removes the user with the given id from collection
    remove = id => this[`${id}`] = undefined;
}
