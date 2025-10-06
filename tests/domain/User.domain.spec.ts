import { Email } from '../../src/Domain/ValueObjects/Email';
import { Phone } from '../../src/Domain/ValueObjects/Phone';
import { RoleAssigner } from '../../src/Domain/Services/RoleAssigner';
import { User } from '../../src/Domain/Entities/User';

describe('Domain — User entity and invariants', () => {
    it('creates user happy path and assigns ADMIN role for company.com', () => {
        const email = Email.create('alice@company.com');
        const phone = Phone.create('+33123456789');
        const role = RoleAssigner.assignFromEmail(email);
        const user = User.create({
            id: 'u1',
            firstName: 'Alice',
            lastName: 'Dupont',
            email,
            phone,
            role
        });

        expect(user.id).toBe('u1');
        expect(user.role).toBe('ADMIN');
        expect(user.email.getValue()).toBe('alice@company.com');
        const prim = user.toPrimitives();
        expect(prim.email).toBe('alice@company.com');
    });

    it('throws on invalid email format', () => {
        expect(() => Email.create('not-an-email')).toThrow('Invalid email format');
    });

    it('updateEmail recalculates role via provided callback', () => {
        const email = Email.create('bob@gmail.com');
        const user = User.create({
            id: 'u2',
            firstName: 'Bob',
            lastName: 'L',
            email,
            phone: Phone.create(null),
            role: 'USER'
        });

        const newEmail = Email.create('bob@company.com');
        user.updateEmail(newEmail, (e) => RoleAssigner.assignFromEmail(e));
        expect(user.role).toBe('ADMIN');
        expect(user.email.getValue()).toBe('bob@company.com');
    });
});
