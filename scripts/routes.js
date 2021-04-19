import express from 'express'
import {extractColors} from "./ColorPicker.js";
export const router = express.Router();
import * as path from 'path'
import {attemptLogin} from '../server.js';

const users = {};


router.get('/', (req, res) => {
    res.render('index.html');
});

router.post('/login', (req, res)=> {
    // Attempt to log in with the given information.
    const response = attemptLogin(req.body.name, req.body.color);

    // Send the response.
    if (response){
        res.json(response);
    }
    else {
        res.status(400);
        res.send('Login rejected');
    }
})

router.get('/colors', (req, res) => {
    res.send(JSON.stringify(extractColors()));
});