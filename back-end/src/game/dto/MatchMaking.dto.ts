import { z } from 'zod';

export const matchMakingDto = z
  .object({
    mapType: z.string(),
    speed: z.string(),
    role: z.string(),
  })
  .required().strip();

type MatchMakingDto = z.infer<typeof matchMakingDto>;

export default MatchMakingDto;