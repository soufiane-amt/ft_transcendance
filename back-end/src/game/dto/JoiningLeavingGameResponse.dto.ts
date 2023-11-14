import { z } from "zod";

export const joiningLeavingGameResponseDto = z.object({
    response: z.string()
}).required().strip();

type JoiningLeavingGameResponseDto = z.infer<typeof joiningLeavingGameResponseDto>;

export default JoiningLeavingGameResponseDto;