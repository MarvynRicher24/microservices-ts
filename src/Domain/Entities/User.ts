import { Role } from "../Enums/Role";
import { Email } from "../ValueObjects/Email";
import { Phone } from "../ValueObjects/Phone";


/**
 * Entité domaine User — encapsule l'état et la logique métier.
 * Aucune dépendance vers ORM / I/O / frameworks.
 */
export class User {
    private constructor(
        private readonly _id: string,
        private _firstName: string,
        private _lastName: string,
        private _email: Email,
        private _phone: Phone,
        private _role: Role,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
        private _deletedAt?: Date | null
    ) { }

    // Factory (création) - verifie invariants essentiels
    public static create(props: {
        id: string;
        firstName: string;
        lastName: string;
        email: Email;
        phone?: Phone;
        role: Role;
        createdAt?: Date;
        updatedAt?: Date;
    }): User {
        if (!props.firstName || !props.lastName) throw new Error('First and last name are required');
        const now = props.createdAt ?? new Date();
        const updated = props.updatedAt ?? now;
        return new User(
            props.id,
            props.firstName.trim(),
            props.lastName.trim(),
            props.email,
            props.phone ?? Phone.create(null),
            props.role,
            now,
            updated,
            null
        );
    }

    // Encapsulated getters (no public setters)
    get id(): string { return this._id; }
    get firstName(): string { return this._firstName; }
    get lastName(): string { return this._lastName; }
    get email(): Email { return this._email; }
    get phone(): Phone { return this._phone; }
    get role(): Role { return this._role; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get deletedAt(): Date | null | undefined { return this._deletedAt; }

    // Méthodes métier : mutent l'état interne de façon contrôlée
    public updateName(firstName?: string, lastName?: string) {
        if (firstName) this._firstName = firstName.trim();
        if (lastName) this._lastName = lastName.trim();
        this.touch();
    }

    public updateEmail(newEmail: Email, recalcRole?: (email: Email) => Role) {
        if (!newEmail) throw new Error('Email is required');
        this._email = newEmail;
        if (recalcRole) {
            this._role = recalcRole(newEmail);
        }
        this.touch();
    }

    public updatePhone(phone: Phone) {
        this._phone = phone;
        this.touch();
    }

    public softDelete() {
        this._deletedAt = new Date();
        this.touch();
    }

    private touch() {
        this._updatedAt = new Date();
    }

    // Export simple/plain-object pour persistence / mapping (Repository)
    public toPrimitives() {
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
