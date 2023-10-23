import { string, z } from "zod";

export const leaveQueueDto = z.object({
        role: z.string()
}).required().strip();

type LeaveQueueDto = z.infer<typeof leaveQueueDto>

export default LeaveQueueDto;