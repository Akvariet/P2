import express from 'express'
import {ColorPicker} from "./ColorPicker.js";
export const router = express.Router();

const colorPicker = new ColorPicker();

function extractColors(){
    const colors = colorPicker.colorsForLoginScreen;
    const hslColors = [];
    for (const color in colors){
        hslColors.push(colorPicker.previewShade(colors[color]));
    }
    return {colors: colors, hslColors:hslColors};
}


router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/colors', (req, res) => {
    res.send(JSON.stringify(extractColors()));
});