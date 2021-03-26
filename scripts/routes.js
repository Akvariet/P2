import path from "path";

const root = path.resolve();

export function configureRouter(router){
    router.get('/', (req, res) => {
        res.sendFile(root + '/public/mainPage.html');
    });

    router.get('/favicon.ico', (req, res) =>{
        res.sendFile(root + '/public/resources/favicon.png');
    });

    router.get('/colors', (req, res) => {
        res.send(JSON.stringify(['red', 'blue', 'green', 'yellow', 'brown', 'grey', 'orange', 'magenta']));
    });

    return router;
}