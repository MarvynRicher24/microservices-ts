// src/repositories/PrismaUserRepository.ts
import { prisma } from '../prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User as DomainUser } from '../Domain/Entities/User';
import { Email } from '../Domain/ValueObjects/Email';
import { Phone } from '../Domain/ValueObjects/Phone';
import { Role } from '../Domain/Enums/Role';

/** Map DB row -> Domain entity or null */
function rowToDomain(row: any): DomainUser | null {
  if (!row) return null;
  return DomainUser.create({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: Email.create(row.email),
    phone: Phone.create(row.phone ?? null),
    role: row.role as Role,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  });
}

export class PrismaUserRepository implements IUserRepository {
  async create(data: any): Promise<DomainUser> {
    const created = await prisma.user.create({ data });
    const domain = rowToDomain(created);
    if (!domain) throw new Error('Failed to map created user');
    return domain;
  }

  async findAll(skip = 0, take = 20): Promise<DomainUser[]> {
    const rows = await prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    // explicit typing on mapping to avoid implicit any
    const mapped = rows.map((row: any) => rowToDomain(row));
    return mapped.filter((r: DomainUser | null): r is DomainUser => r !== null);
  }

  async findById(id: string): Promise<DomainUser | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    if (!row || row.deletedAt) return null;
    return rowToDomain(row);
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const row = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    if (!row) return null;
    return rowToDomain(row);
  }

  async update(id: string, data: any): Promise<DomainUser> {
    const updated = await prisma.user.update({ where: { id }, data });
    const domain = rowToDomain(updated);
    if (!domain) throw new Error('Failed to map updated user');
    return domain;
  }

  async softDelete(id: string): Promise<DomainUser> {
    const deleted = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    const domain = rowToDomain(deleted);
    if (!domain) throw new Error('Failed to map deleted user');
    return domain;
  }
}
