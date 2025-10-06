"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRoleFromEmail = assignRoleFromEmail;
function assignRoleFromEmail(email) {
    if (!email)
        return 'USER';
    const domain = email.split('@')[1]?.toLowerCase() ?? '';
    return domain === 'company.com' ? 'ADMIN' : 'USER';
}
//# sourceMappingURL=role.util.js.map