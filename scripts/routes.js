import express from 'express'
import {extractColors} from "./ColorPicker.js";
export const router = express.Router();

import {attemptLogin} from '../server.js';

router.get('/', (req, res) => {
    res.render('index.html');
});

router.post('/login', (req, res)=> {
    // Attempt to log in with the given information.
    let response;
    try{
        response = attemptLogin(req.body.name, req.body.color);
    }
    catch (e){
        console.log(e);
    }

    // Send the response.
    if (response)
        res.json(response);

    else {
        res.status(400);
        res.send('Login rejected');
    }
})

router.get('/colors', (req, res) => {
    res.send(JSON.stringify(extractColors()));
});