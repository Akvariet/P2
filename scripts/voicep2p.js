export function conn(client){
    console.log("PeerJS: " + client.id + " Connected");
}

export function disconn(client){
    console.log("PeerJS: " + client.id + " Disonnected");
}