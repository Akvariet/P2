export class ConnectionTable {
    connections = {}

    newConnection(socketID, gameID){
        this.connections[socketID] = gameID;
    }

    gameID(socketID){
        return this.connections[socketID];
    }
}