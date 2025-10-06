"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAssigner = void 0;
const Role_1 = require("../Enums/Role");
/**
 * RoleAssigner contient la logique métier qui décide quel Role attribuer
 * en fonction d'un Email. Aucune dépendance I/O.
 */
class RoleAssigner {
    static assignFromEmail(email) {
        const domain = email.getDomain();
        return domain === 'company.com' ? Role_1.RoleValues.ADMIN : Role_1.RoleValues.USER;
    }
}
exports.RoleAssigner = RoleAssigner;
//# sourceMappingURL=RoleAssigner.js.map