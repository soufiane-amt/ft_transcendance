import { Role } from "@prisma/client";
export declare const KEY_ROLE = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
