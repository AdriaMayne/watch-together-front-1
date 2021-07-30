import io from "socket.io-client";

const URL = process.env.BACKEND_URL;
console.log("Url", URL);
const socket = io(URL);

// socket.onAny((event, ...args) => {
//   console.log("Global on any", event, args);
// });

export default socket;
