import { NextFunction } from "express"
import { Socket } from "socket.io"
import { GatewaysGuard } from "./guards/gateways.guard";
import { WsException } from "@nestjs/websockets";
import ClientSocket from "./interfaces/clientSocket.interface";
import { HttpStatus } from "@nestjs/common";
import { GameService } from "./game.service";
import Player from "./Game/classes/Player";

export type wsmiddleware = (client: ClientSocket, next: NextFunction) => Promise<void>
type SocketIOMiddleware = (gameservice: GameService) => wsmiddleware;

const socketIOMiddleware: SocketIOMiddleware = (gameservice: GameService) => {
    return async (client: ClientSocket, next: NextFunction) => {
        try {
            const userId = GatewaysGuard.validateJwt(client);
            client.userId = userId;
            client.player = await gameservice.get_player(client);
            if (client.player === null) throw new Error();
            next();
        }  catch {
            next(new WsException({ message: 'unauthorized client', status: HttpStatus.UNAUTHORIZED }));
        }
    }
}

export default socketIOMiddleware;