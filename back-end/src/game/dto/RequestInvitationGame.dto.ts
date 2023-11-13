import { z } from "zod";

export const requestInvitationGameDto = z.object({
    game_id: z.string()
}).required().strip();

type RequestInvitationGameDto = z.infer<typeof requestInvitationGameDto>;

export default RequestInvitationGameDto;