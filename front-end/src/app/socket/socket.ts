import { io } from "socket.io-client";
import Cookies from "js-cookie";

const JwtToken = Cookies.get("access_token");

const socket = io("http://localhost:3001/chat", {
  transports: ["websocket", "polling", "flashsocket"],
  
  query: {
      token: `Bearer ${JwtToken}`,
  }

});

export default socket;