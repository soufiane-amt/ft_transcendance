import { Socket } from "socket.io";

export interface Player {
  id: string;
  username: string;
  level: number;
  socket: Socket
}
