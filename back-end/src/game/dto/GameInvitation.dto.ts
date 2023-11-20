import { z } from "zod";

export const gameInvitationDto = z.object({
    invitee_id: z.string(),
    invitor_id: z.string(),
    mapType: z.string(),
    speed: z.string()
}).required().strip()

type GameInvitationDto = z.infer<typeof gameInvitationDto>

export default GameInvitationDto;

