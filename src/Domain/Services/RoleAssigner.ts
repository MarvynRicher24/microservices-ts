import { Role, RoleValues } from '../Enums/Role';
import { Email } from '../ValueObjects/Email';

/**
 * RoleAssigner contient la logique métier qui décide quel Role attribuer
 * en fonction d'un Email. Aucune dépendance I/O.
 */
export class RoleAssigner {
    static assignFromEmail(email: Email): Role {
        const domain = email.getDomain();
        return domain === 'company.com' ? RoleValues.ADMIN : RoleValues.USER;
    }
}
