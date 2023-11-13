import { Server } from "socket.io";

export default class GameServer extends Server {
    mainServer: Server;
}