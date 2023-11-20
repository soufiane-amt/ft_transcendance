import { io } from "socket.io-client";
import Cookies from "js-cookie";

const JwtToken = Cookies.get("access_token");
const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERV}`, {
  transports: ["websocket"],
  query: {
    token: `Bearer ${JwtToken}`,
  },
});

export default newSocket;
