import { GameStatus }  from "@prisma/client";

export default interface CreateGame {
    player1_id: string;
    player2_id: string;
}