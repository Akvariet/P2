let socket;

const gameData = {};
const oldData = {};

const tickRate = 15;

/**
 * Connects to the server using socket.io.
 * @param {Socket} s
 */
export function connectSocket(s){
    socket = s;
    socket.open();

    // Send updates to server each tick
    setInterval(() => {
        Object.keys(gameData).forEach(event => {
            if(gameData[event] !== oldData[event]){
                emit(event, ...gameData[event]);
                oldData[event] = gameData[event];
            }
        })
    }, 1000/tickRate);
}


export function emit(event, ...args){
    socket.emit(event, ...args);
}

export function on(event, listener){
    socket.on(event, listener);
}

export function updateData(event, ...data){
    gameData[event] = data;
}