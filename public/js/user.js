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
    static hslColors = ['hsl(0, 80%, 69%)', 'hsla(325, 88%, 78%)', 'hsl(17, 88%, 78%)', 'hsl(270, 88%, 78%)', 'hsl(44, 88%, 78%)', 'hsl(212, 88%, 78%)', 'hsl(97, 78%, 82%)', 'hsl(166, 85%, 71%)']
    static index = 0;

    static nextColor = index => {
        const pattern = /\d+/g;
        let hsl = [354, 88, 71];
        let fail = false;

        try {hsl = colorPicker.hslColors[index].match(pattern);}
        catch (e) {console.log( e +'error orcurred'); fail = true}

        hsl[0] = (hsl[0] + 15) % 360; // Rotate hue.
        colorPicker.hslColors[index] = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
        return fail;
    }

    static previewColors = () => colorPicker.hslColors;

    static colorIndex  = hsl =>
        colorPicker.hslColors.indexOf(hsl);

    static selectColor = hsl => {
        const index = colorPicker.colorIndex(hsl);
        let color = colorPicker.hslColors[index];
        let failed = colorPicker.nextColor(index);
        if (failed)
            color =colorPicker.randomColor();
        return color;
    }

    static randomColor = () => {
        const index = Math.round(Math.random() * (colorPicker.hslColors.length - 1));
        return colorPicker.hslColors[index];
    }
}