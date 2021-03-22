import express from 'express';
import {configureRouter} from "./scripts/routes.js";
import {createServer} from 'http';
import bodyParser from 'body-parser'
import {UserProperties} from "./scripts/user.js";
import {ConnectionTable} from "./scripts/connection.js";
import {AkvarioServer} from "./scripts/sockets.js";

const app = express();
const HTTPServer = createServer(app);


const port = process.env.PORT || 3000;

const akvarioServer = new AkvarioServer(HTTPServer);
const userData = new UserProperties();


export function connectNewUser(name, color){
    const user = userData.create(name, color);
    const connection = new ConnectionTable(user);
    return user;
}
export function getUserData(){
    return userData;
}

export function getUserDataJSON(){
    return userData.toJSON();
}
//userData.add('1','Simon', 'red', {top: 500, left: 500}, 2);

const router = configureRouter(express.Router());
app.use(bodyParser.json())
app.use('/', router);

//listens to PORT set on top.
HTTPServer.listen(port, () => {
    console.log(`Welcome to Akvario @ *:${port}`);
});