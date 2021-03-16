export class UserCollection{
    constructor() {
        this.users = {};
    }

    // Returns the user with the given id.
    get = id => this.users[`${id}`];

    //Creates an entirely new user and adds it to the collection.
    static make = (id, name, color, pos, rad) =>
    {
        return {
            id: id,
            name:  name  || '',
            color: color || `rgb(0,0,0)`,
            pos:   pos   || { top: 0, left: 0 },
            rad:   rad   || 0
        }};

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

export class colorPicker{
    static availableColors = ['#f67280', '#99B898', '#C06C84', '#6C5B7B', '#FF847C', '#FFBF8D', '#355C7D'];
    static hslColors = ['hsl(354, 88%, 71%)', 'hsl(118, 18%, 66%)', 'hsl(343, 40%, 59%)', 'hsl(272, 15%, 42%)', 'hsl(4, 100%, 74%)', 'hsl(26, 100%, 78%)', 'hsl(208, 40%, 35%)']
    static index = 0;

    static nextColor = index => {
        const pattern = /\d+/g;
        let hsl = [354, 88, 71];

        try {hsl = colorPicker.hslColors[index].match(pattern);}
        catch (e) {console.error(e);}

        hsl[0] = (hsl[0] + 15) % 360; // Rotate hue.
        colorPicker.hslColors[index] = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
    }

    static previewColors = () => colorPicker.hslColors;

    static colorIndex  = hsl =>
        colorPicker.hslColors.indexOf(hsl);

    static selectColor = hsl => {
        const index = colorPicker.colorIndex(hsl);
        const color = colorPicker.hslColors[index];
        colorPicker.nextColor(index);
        return color;
    }

    static randomColor = () => {
        const index = Math.round(Math.random() * (colorPicker.hslColors.length - 1));
        return colorPicker.hslColors[index];
    }
}