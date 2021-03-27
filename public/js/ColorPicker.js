import colors from "../resources/colorPalette.js"
export class ColorPicker {
    //Creates a color palette based on the colorPalette file
    colorPalette = colors;

    get colorsForLoginScreen() {
        //Creates an array of the different colors the user can chose between
        //e.g. ["red","blue"]
        const colors = [];
        Object.keys(this.colorPalette).forEach(color => {
            colors.push(color);
        });
        return colors;
    }

    previewShade(color) {
        //returns the hsl color of the input color
        //e.g. "red" => "hsl(0, 100%, 74%)"
        return (this.colorPalette[color])[0];
    }

    counters = {
        //Counters for each color to keep track of which shades has been given
        red: 0, orange: 0, yellow: 0, green: 0,
        cyan: 0, blue: 0, purple: 0, pink: 0
    };

    getShade(color) {
        //Returns the next shade of the chosen color
        const count = this.counters[color]++;
        this.counters[color] %= this.colorPalette[color].length;
        return (this.colorPalette[color])[count];
    }
}
