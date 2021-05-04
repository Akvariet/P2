/************************************************
* This is where the client side is configured.  *
* Just change production to true, when          *
* running on the AAU Server.                    *
*                                               *
* When adding new configurations, please write  *
* the function name in the case                 *
************************************************/

export function config(func, cid){
    const production = false;

    if(production){
        switch(func){

            case 'peerConnection': return {host: "audp2p.herokuapp.com", port: 443, secure: true};
            case 'main':           return {auth:{token: cid}, path:'/node0/socket.io', transports: ["polling"]};

            //login.js
            case 'getColors':      return '/node0/colors';
            case 'login':          return '/node0/login';  

            //popUpMenu.js
            case 'notMute':        return '/node0/resources/mic-fill.svg';
            case 'mute':           return '/node0/resources/mic-mute-fill.svg';
            case 'notDeaf':        return '/node0/resources/volume-up-fill.svg';
            case 'deaf':           return '/node0/resources/volume-mute-fill.svg';
        }
    } else {
        switch (func){

            case 'peerConnection': return {host: "audp2p.herokuapp.com", port: 443, secure: true, debug: 2};
            case 'main':           return {auth:{token: cid}};

            //login.js
            case 'getColors':      return '/colors';
            case 'login':          return '/login';   
            
            //popUpMenu.js
            case 'notMute':         return '/resources/mic-fill.svg';
            case 'mute':           return '/resources/mic-mute-fill.svg';
            case 'notDeaf':        return '/resources/volume-up-fill.svg';
            case 'deaf':           return '/resources/volume-mute-fill.svg';
        }
    }
}