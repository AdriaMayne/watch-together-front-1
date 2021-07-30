import io from "socket.io-client";

const URL = process.env.VUE_APP_BACKEND_URL;
console.log("Back", URL);
const socket = io(URL);
// socket.onAny((event, ...args) => {
//   console.log("Global on any", event, args);
// });

export default socket;
