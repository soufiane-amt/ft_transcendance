import { z } from "zod";

export const gameInvitationFromChatDto = z.object({
    inviteeId: z.string()
}).required().strip();

type GameInvitationFromChatDto = z.infer<typeof gameInvitationFromChatDto>;

export default GameInvitationFromChatDto;