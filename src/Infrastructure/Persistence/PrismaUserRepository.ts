// @ts-nocheck
const { prisma } = require('../../prisma/client');
const { User: DomainUser } = require('../../Domain/Entities/User');
const { Email } = require('../../Domain/ValueObjects/Email');
const { Phone } = require('../../Domain/ValueObjects/Phone');
const { Role } = require('../../Domain/Enums/Role');

/* map DB row -> DomainUser or null */
function rowToDomain(row) {
  if (!row) return null;
  return DomainUser.create({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: Email.create(row.email),
    phone: Phone.create(row.phone ?? null),
    role: row.role,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  });
}

class PrismaUserRepository {
  async create(data) {
    const created = await prisma.user.create({ data });
    const domain = rowToDomain(created);
    if (!domain) throw new Error('Mapping created user failed');
    return domain;
  }

  async findAll(skip = 0, take = 20) {
    const rows = await prisma.user.findMany({ where: { deletedAt: null }, skip, take, orderBy: { createdAt: 'desc' } });
    return rows.map((r) => rowToDomain(r)).filter((r) => r !== null);
  }

  async findById(id) {
    const row = await prisma.user.findUnique({ where: { id } });
    if (!row || row.deletedAt) return null;
    return rowToDomain(row);
  }

  async findByEmail(email) {
    const row = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    if (!row) return null;
    return rowToDomain(row);
  }

  async update(id, data) {
    const updated = await prisma.user.update({ where: { id }, data });
    const domain = rowToDomain(updated);
    if (!domain) throw new Error('Mapping updated user failed');
    return domain;
  }

  async softDelete(id) {
    const deleted = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    const domain = rowToDomain(deleted);
    if (!domain) throw new Error('Mapping deleted user failed');
    return domain;
  }
}

module.exports = { PrismaUserRepository };
