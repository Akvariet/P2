

export class UserProperties{
    users = {};
    userProperties = {
        position: {},
        rotation: {},
        name:     {},
        color:    {}
    }

    _previousID = 0;
    _freeIDs = [];
    _initialPosition = {top:10, left:10};
    _initialRotation = 0;

    // Returns the user with the given id.
    get = id => {
        if (!this.exists(id)) return undefined;

        const properties = {id: id};

        // Find all of the users properties in the userProperties object.
        Object.keys(this.userProperties).forEach(prop =>
            properties[prop] = this.userProperties[prop][id]);

        return properties;
    }

    // Creates a new user and adds it to the collection.
    create(name, color){
        const id = this.nextID() || this._freeIDs.pop();
        return this.add(id, name, color, this._initialPosition, this._initialRotation);
    }

    nextID = () => ++this._previousID;

    // Adds a user to collection, Returns the id.
    add = (id, name, color, position, rotation) => {
        // Check if it exists already...
        if (this.exists(id))
            console.warn(`user with id ${id} already existed! Did you mean to override?`);

        // ..Otherwise, add it.
        else {
            const properties = this.userProperties;

            // The user object contains getters and setters that can be used to retrieve the properties related to it.
            const user = this.users[id] = {
                get position() {return properties.position(id)},
                get rotation() {return properties.rotation(id)},
                get name()     {return properties.name(id)},
                get color()    {return properties.color(id)},

                set position(position) {properties.position[id] = position},
                set rotation(rotation) {properties.rotation[id] = rotation},
                set name(name)   {properties.name[id]  = name},
                set color(color) {properties.color[id] = color},

                setProperty(property, value){
                    properties[property][id] = value;
                }
            };

            // Add the user to the userProperties object.
            user.name  = name;
            user.color = color;
            user.position = position;
            user.rotation = rotation;
        }

        // Return the user which was just added.
        return this.get(id);
    }

    // Get properties of all users.
    get positions() {return this.userProperties.position}
    get rotations() {return this.userProperties.rotation}
    get names()     {return this.userProperties.name}
    get colors()    {return this.userProperties.color}

    // Does the user with the given id exist?
    exists = id => this.users.hasOwnProperty(id);

    // Removes the user with the given id from collection.
    remove = id =>{
        if(this.exists(id)){
            Object.keys(this.userProperties).forEach(prop => delete this.userProperties[prop][id]);
            delete this.users[id];
            this._freeIDs.push(id);
        }

        else console.warn(`user with id ${id} did not exist and could not be deleted!`);
    }

    // Returns an array containing all users.
    allUsers = () => {
        const allUsers = [];
        for (const user in this.users){
            allUsers.push(this.get(user));
        }
        return allUsers;
    }
}