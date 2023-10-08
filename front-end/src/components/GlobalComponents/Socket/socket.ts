import { io } from 'socket.io-client';
import Cookies from "js-cookie";

const JwtToken = Cookies.get("access_token");
const newSocket = io('http://localhost:3001', {
  transports: ['websocket'],
  query: {
      token: `Bearer ${JwtToken}`,
  }
});


export default newSocket;
