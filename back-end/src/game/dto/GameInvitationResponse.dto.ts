import { z } from "zod";

export const gameInvitationResponseDto = z.object({
    invitee_id: z.string(),
    invitor_id: z.string(),
    mapType: z.string(),
    speed: z.string(),
    response: z.string()
}).required().strip();

type GameInvitationResponseDto = z.infer<typeof gameInvitationResponseDto>;

export default GameInvitationResponseDto;