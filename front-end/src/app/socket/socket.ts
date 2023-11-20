import { io } from "socket.io-client";
import Cookies from "js-cookie";

const JwtToken = Cookies.get("access_token");

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat`, {
  transports: ["websocket"],

  query: {
    token: `Bearer ${JwtToken}`,
  },
});

export default socket;
