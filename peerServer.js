import {PeerServer} from 'peer';
import * as voice from './scripts/voicep2p.js'
const port = 3201;
const peerServer = PeerServer({
    secure: true,
    port: port,
    path: '/'
});
console.log("PeerServer @" + port);
peerServer.on('connection', voice.conn);
peerServer.on('disconnect', voice.disconn);
