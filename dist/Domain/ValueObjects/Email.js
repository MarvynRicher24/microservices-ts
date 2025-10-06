"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(email) {
        if (!email || typeof email !== 'string')
            throw new Error('Email must be a non empty string');
        const normalized = email.trim().toLowerCase();
        const emailRegex = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(normalized))
            throw new Error('Invalid email format');
        return new Email(normalized);
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    getDomain() {
        const parts = this.value.split('@');
        return parts.length === 2 ? parts[1] : '';
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map