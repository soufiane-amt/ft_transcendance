import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

//Setting metadata aliases
export const KEY_ROLE = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(KEY_ROLE, roles);

