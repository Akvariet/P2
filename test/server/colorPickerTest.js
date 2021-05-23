import {test} from '../testServer.js';
import {TestSuite} from "../testClasses.js";
import {ColorPicker} from "../../scripts/ColorPicker.js";
import shades from "../../resources/colorPalette.js"

const testSuite = new TestSuite("colorPicker.js");
const colorPicker = new ColorPicker();

function previewShade(color){
    return colorPicker.previewShade(color);
}
function getShade(color){
    return colorPicker.getShade(color);
}

const colors = Object.keys(shades);

// For every color in the input file, the program should...
for (const color of colors) {
    // ...Preview all shades...
    testSuite.addFunctionTest(previewShade,
        [color],
        shades[color][0]);

    const input = [color, color.toUpperCase(), color, color.toUpperCase(), color, color.toUpperCase(), color, color.toUpperCase(), color, "nonexistent color"];
    // ...Get each shade...
    for (let i = 0; i < input.length; i++) {
        if (colors.includes(input[i].toLowerCase()))
            testSuite.addFunctionTest(getShade, [input[i]], shades[color][i%shades[color].length]);

        else testSuite.addFunctionTest(getShade,
            [input[i]],
            undefined);
    }

}


export function colorPickerTest (){
    test.addSuite(testSuite);
}
