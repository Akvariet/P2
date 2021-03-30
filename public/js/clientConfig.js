//if AAU Server set to true
export const production = false;

export function options(file,prod){
    switch(file){
        case 'voice':
            if(prod) 
                return { host:'sw2b2-18.p2datsw.cs.aau.dk', path:'/node1'};
            return { host: 'localhost', port: 3201};
        case 'main':
            if(prod) 
                return {autoConnect: false, path:'/node0/socket.io'};
            return {autoConnect: false};
    }
}