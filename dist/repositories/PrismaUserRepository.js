"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
// src/repositories/PrismaUserRepository.ts  (extrait)
const client_1 = require("../prisma/client");
const User_1 = require("../Domain/Entities/User");
const Email_1 = require("../Domain/ValueObjects/Email");
const Phone_1 = require("../Domain/ValueObjects/Phone");
// helper : map db row -> domain entity
function rowToDomain(row) {
    if (!row)
        return null;
    return User_1.User.create({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: Email_1.Email.create(row.email),
        phone: Phone_1.Phone.create(row.phone ?? null),
        role: row.role,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
    });
}
class PrismaUserRepository {
    async create(data) {
        // data can be either DTO-like or primitives from user.toPrimitives()
        const created = await client_1.prisma.user.create({ data });
        return rowToDomain(created);
    }
    async findById(id) {
        const row = await client_1.prisma.user.findUnique({ where: { id } });
        if (!row || row.deletedAt)
            return null;
        return rowToDomain(row);
    }
    async findByEmail(email) {
        const row = await client_1.prisma.user.findFirst({ where: { email, deletedAt: null } });
        if (!row)
            return null;
        return rowToDomain(row);
    }
    async findAll(skip = 0, take = 20) {
        const rows = await client_1.prisma.user.findMany({
            where: { deletedAt: null },
            skip, take,
            orderBy: { createdAt: 'desc' }
        });
        return rows.map(rowToDomain);
    }
    async update(id, data) {
        // data expected as plain fields to update (email string, firstName, etc.)
        const updated = await client_1.prisma.user.update({ where: { id }, data });
        return rowToDomain(updated);
    }
    async softDelete(id) {
        const deleted = await client_1.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
        return rowToDomain(deleted);
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
//# sourceMappingURL=PrismaUserRepository.js.map