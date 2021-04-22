/************************************************
* This is where the client side is configured.  *
* Just change production to true, when          *
* running on the AAU Server.                    *
*                                               *
* When adding new configurations, please write  *
* the function name in the case                 *
************************************************/

export function config(func){
    const production = false;

    if(production){
        switch(func){

            case 'PeerVoiceConnection': return {host: "audp2p.herokuapp.com", port: 443, secure: true};
            case 'ClientConnection':    return {autoConnect: false, path:'/node0/socket.io', transports: ["polling"]};

            //login.js
            case 'getColors':             return '/node0/colors';
        }
    } else {
        switch (func){

            case 'PeerVoiceConnection': return {host: "audp2p.herokuapp.com", port: 443, secure: true, debug: 2};
            case 'ClientConnection':    return {autoConnect: false};

            //login.js
            case 'getColors':             return '/colors';
        }
    }
}