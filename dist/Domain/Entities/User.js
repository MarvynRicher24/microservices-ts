"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Entité domaine User — encapsule l'état et la logique métier.
 * Aucune dépendance vers ORM / I/O / frameworks.
 */
class User {
    constructor(_id, _firstName, _lastName, _email, _phone, _role, _createdAt, _updatedAt, _deletedAt) {
        this._id = _id;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._email = _email;
        this._phone = _phone;
        this._role = _role;
        this._createdAt = _createdAt;
        this._updatedAt = _updatedAt;
        this._deletedAt = _deletedAt;
    }
    // Factory (création) - verifie invariants essentiels
    static create(props) {
        if (!props.firstName || !props.lastName)
            throw new Error('First and last name are required');
        const now = props.createdAt ?? new Date();
        const updated = props.updatedAt ?? now;
        return new User(props.id, props.firstName.trim(), props.lastName.trim(), props.email, props.phone ?? Phone.create(null), props.role, now, updated, null);
    }
    // Encapsulated getters (no public setters)
    get id() { return this._id; }
    get firstName() { return this._firstName; }
    get lastName() { return this._lastName; }
    get email() { return this._email; }
    get phone() { return this._phone; }
    get role() { return this._role; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get deletedAt() { return this._deletedAt; }
    // Méthodes métier : mutent l'état interne de façon contrôlée
    updateName(firstName, lastName) {
        if (firstName)
            this._firstName = firstName.trim();
        if (lastName)
            this._lastName = lastName.trim();
        this.touch();
    }
    updateEmail(newEmail, recalcRole) {
        if (!newEmail)
            throw new Error('Email is required');
        this._email = newEmail;
        if (recalcRole) {
            this._role = recalcRole(newEmail);
        }
        this.touch();
    }
    updatePhone(phone) {
        this._phone = phone;
        this.touch();
    }
    softDelete() {
        this._deletedAt = new Date();
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
    // Export simple/plain-object pour persistence / mapping (Repository)
    toPrimitives() {
        return {
            id: this._id,
            firstName: this._firstName,
            lastName: this._lastName,
            email: this._email.getValue(),
            phone: this._phone.getValue(),
            role: this._role,
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
            deletedAt: this._deletedAt ? this._deletedAt.toISOString() : null
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map