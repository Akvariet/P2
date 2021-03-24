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

export class ColorPicker{
    constructor() {
        this.colorPalette = {
            red:    ['hsl(0, 100%, 74%)', 'hsl(0, 100%, 68%)', 'hsl(0, 100%, 62%)', 'hsl(0, 100%, 56%)', 'hsl(0, 100%, 48%)', 'hsl(0, 100%, 44%)', 'hsl(0, 100%, 38%)', 'hsl(0, 100%, 32%)'],
            orange: ['hsl(32, 100%, 74%)', 'hsl(32, 100%, 68%)', 'hsl(32, 100%, 62%)', 'hsl(32, 100%, 56%)', 'hsl(32, 100%, 50%)', 'hsl(32, 100%, 44%)', 'hsl(32, 100%, 38%)', 'hsl(32, 100%, 32%)'],
            yellow: ['hsl(60, 100%, 74%)', 'hsl(60, 100%, 68%)', 'hsl(60, 100%, 62%)', 'hsl(60, 100%, 56%)', 'hsl(60, 100%, 50%)', 'hsl(60, 100%, 44%)', 'hsl(60, 100%, 38%)', 'hsl(60, 100%, 32%)'],
            green:  ['hsl(119, 100%, 74%)', 'hsl(119, 100%, 68%)', 'hsl(119, 100%, 62%)', 'hsl(119, 100%, 56%)', 'hsl(119, 100%, 50%)', 'hsl(119, 100%, 44%)', 'hsl(119, 100%, 38%)', 'hsl(119, 100%, 32%)'],
            cyan:   ['hsl(179, 100%, 74%)', 'hsl(179, 100%, 68%)', 'hsl(179, 100%, 62%)', 'hsl(179, 100%, 56%)', 'hsl(179, 100%, 50%)', 'hsl(179, 100%, 44%)', 'hsl(179, 100%, 38%)', 'hsl(179, 100%, 32%)'],
            blue:   ['hsl(212, 100%, 74%)', 'hsl(212, 100%, 68%)', 'hsl(212, 100%, 62%)', 'hsl(212, 100%, 56%)', 'hsl(212, 100%, 50%)', 'hsl(212, 100%, 44%)', 'hsl(212, 100%, 38%)', 'hsl(212, 100%, 32%)'],
            purple: ['hsl(275, 100%, 74%)', 'hsl(275, 100%, 68%)', 'hsl(275, 100%, 62%)', 'hsl(275, 100%, 56%)', 'hsl(275, 100%, 50%)', 'hsl(275, 100%, 44%)', 'hsl(275, 100%, 38%)', 'hsl(275, 100%, 32%)'],
            pink:   ['hsl(316, 100%, 74%)', 'hsl(316, 100%, 68%)', 'hsl(316, 100%, 62%)', 'hsl(316, 100%, 56%)', 'hsl(316, 100%, 50%)', 'hsl(316, 100%, 44%)', 'hsl(316, 100%, 38%)', 'hsl(316, 100%, 32%)']
        };
    }
    get colorsForLoginScreen () {
        const colors = [];
        Object.keys(this.colorPalette).forEach(color => {
            colors.push(color);
        });
        return colors;
    }

    counters = {
        red:0, orange:0, yellow:0, green:0,
        cyan:0, blue:0, purple:0, pink:0};

    getShade(color) {
        console.log(color);
        const count = this.counters[color]++;
        this.counters[color] %= this.colorPalette[color].length;
        return (this.colorPalette[color])[count];
    }

    previewShade(color) {
        return (this.colorPalette[color])[0];
    }
    selectColor(color) {
        return this.getShade(color);
    }
}