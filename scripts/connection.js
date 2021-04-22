
export const clients = {
    cid: {
        gameID: 'gameid',
        socketID: 'socketid'
    },
    addID(client, type, id){
        this[client][type] = id;
    }
}

export function newConnection(cID, gameID){
    clients[cID] = gameID;
}

export function gameID(cID){
    return clients[cID];
}
