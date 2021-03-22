import path from "path";
import {connectNewUser, getUserDataJSON} from "../app.js";

const root = path.resolve();

export function configureRouter(router){

    router.get('/', (req, res) => {
        res.sendFile(root + '/public/mainPage.html');
    });

    router.get('/favicon.ico', (req, res) =>{
        res.sendFile(root + '/public/resources/favicon.png');
    });

    router.get('/js/main.js', (req, res) => {
        res.sendFile(root + '/public/js/main.js');
    });

    router.get('/js/client.js', (req, res) => {
        res.sendFile(root + '/public/js/client.js');
    });

    router.get('/js/user.js', (req, res) => {
        res.sendFile(root + '/public/js/user.js');
    });

    router.get('/css/login.css', (req, res) => {
        res.sendFile(root + '/public/css/login.css');
    });

    router.get('/css/room.css', (req, res) => {
        res.sendFile(root + '/public/css/room.css');
    });

    router.get('/colors', (req, res) => {
        res.send(JSON.stringify(['red', 'blue', 'green', 'yellow', 'brown', 'grey', 'orange', 'magenta']));
    });

    router.post('/login', (req, res) =>{
        const user = connectNewUser(req.body.username, req.body.color);
        res.send(JSON.stringify(user));
    });

    router.get('/users', (req, res) => {
        res.send(getUserDataJSON());
    });

    router.post('/connect', (req, res) => {
        const params = req.json();
    })

    return router;
}