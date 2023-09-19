"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.KEY_ROLE = void 0;
const common_1 = require("@nestjs/common");
exports.KEY_ROLE = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.KEY_ROLE, roles);
exports.Roles = Roles;
//# sourceMappingURL=chat.decorator.js.map