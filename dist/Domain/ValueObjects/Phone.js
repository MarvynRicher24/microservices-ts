"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
class Phone {
    constructor(value) {
        this.value = value;
    }
    static create(phone) {
        if (!phone)
            return new Phone(null);
        const normalized = phone.trim();
        const simpleRegex = /^[0-9+()\- \s]{6,20}$/;
        if (!simpleRegex.test(normalized))
            throw new Error('Invalid phone format');
        return new Phone(normalized);
    }
    getValue() {
        return this.value;
    }
}
exports.Phone = Phone;
//# sourceMappingURL=Phone.js.map