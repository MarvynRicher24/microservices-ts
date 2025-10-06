export class Email {
    private constructor(private readonly value: string) { }

    public static create(email: string): Email {
        if (!email || typeof email !== 'string') throw new Error('Email must be a non empty string');
        const normalized = email.trim().toLowerCase();
        const emailRegex = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(normalized)) throw new Error('Invalid email format');
        return new Email(normalized);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.value;
    }

    public getDomain(): string {
        const parts = this.value.split('@');
        return parts.length === 2 ? parts[1] : '';
    }
}
