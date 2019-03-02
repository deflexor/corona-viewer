
import io from "socket.io-client";
import { WS_URL } from './config';

let socketWS = io(WS_URL);

function connectWS(cb) {
  socketWS.on('message', (message) => {
    cb(message);
  });
}

export { connectWS };
