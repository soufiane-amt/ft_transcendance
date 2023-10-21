import { NextFunction } from "express"
import { Socket } from "socket.io"
import { GatewaysGuard } from "./guards/gateways.guard";
import { WsException } from "@nestjs/websockets";
import ClientSocket from "./interfaces/clientSocket.interface";
import { HttpStatus } from "@nestjs/common";

type SocketIOMiddleware = {
    (client: Socket, next: NextFunction ) : void;
}

const socketIOMiddleware: SocketIOMiddleware = (client: ClientSocket, next: NextFunction) => {
    try {
        const userId = GatewaysGuard.validateJwt(client);
        client.userId = userId;
        next();
    } catch {
        next(new WsException({ message: 'unauthorized client', status: HttpStatus.UNAUTHORIZED }));
    }
}

export default socketIOMiddleware;