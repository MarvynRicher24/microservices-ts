import { prisma } from '../../prisma/client';
import { IUserRepositoryPort } from '../../Application/Ports/IUserRepositoryPort';
import { User as DomainUser } from '../../Domain/Entities/User';
import { Email } from '../../Domain/ValueObjects/Email';
import { Phone } from '../../Domain/ValueObjects/Phone';
import { Role } from '../../Domain/Enums/Role';

/* map DB row -> DomainUser or null */
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

export class PrismaUserRepository implements IUserRepositoryPort {
  async create(data: any): Promise<DomainUser> {
    const created = await prisma.user.create({ data });
    const domain = rowToDomain(created);
    if (!domain) throw new Error('Mapping created user failed');
    return domain;
  }

  async findAll(skip = 0, take = 20): Promise<DomainUser[]> {
    const rows = await prisma.user.findMany({ where: { deletedAt: null }, skip, take, orderBy: { createdAt: 'desc' } });
    return rows.map((r: any) => rowToDomain(r)).filter((r): r is DomainUser => r !== null);
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
    if (!domain) throw new Error('Mapping updated user failed');
    return domain;
  }

  async softDelete(id: string): Promise<DomainUser> {
    const deleted = await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    const domain = rowToDomain(deleted);
    if (!domain) throw new Error('Mapping deleted user failed');
    return domain;
  }
}
