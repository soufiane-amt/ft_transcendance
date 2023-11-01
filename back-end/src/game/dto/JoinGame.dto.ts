import { z } from "zod";

export const joinGameDto = z.object({
    player1_id: z.string(),
    player2_id: z.string(),
    speed: z.string(),
    game_id: z.string(),
    mapType: z.string()
}).required().strip();

type JoinGameDto = z.infer<typeof joinGameDto>;
export default JoinGameDto;