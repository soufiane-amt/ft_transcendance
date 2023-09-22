import { io } from "socket.io-client";

const socket = io("http://localhost:3001/chat", {
  transports: ["websocket", "polling", "flashsocket"],

  withCredentials: true,
});

export default socket;