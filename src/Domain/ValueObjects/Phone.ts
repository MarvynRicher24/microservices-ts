export class Phone {
    private constructor(private readonly value: string | null) { }

    public static create(phone?: string | null): Phone {
        if (!phone) return new Phone(null);
        const normalized = phone.trim();
        const simpleRegex = /^[0-9+()\- \s]{6,20}$/;
        if (!simpleRegex.test(normalized)) throw new Error('Invalid phone format');
        return new Phone(normalized);
    }

    public getValue(): string | null {
        return this.value;
    }
}
