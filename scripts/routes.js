import express from 'express'
import {extractColors} from "./ColorPicker.js";
export const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/colors', (req, res) => {
    res.send(JSON.stringify(extractColors()));
});