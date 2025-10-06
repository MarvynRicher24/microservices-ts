// src/services/UserService.ts
import { IUserRepository } from '../interfaces/IUserRepository';
import { User as DomainUser } from '../Domain/Entities/User';
import { UserInputDto } from '../Application/DTOs/UserInputDto';
import { UserUpdateDto } from '../Application/DTOs/UserUpdateDto';
import { Email } from '../Domain/ValueObjects/Email';
import { Phone } from '../Domain/ValueObjects/Phone';
import { RoleAssigner } from '../Domain/Services/RoleAssigner';

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(data: UserInputDto): Promise<DomainUser> {
    // create VOs
    const emailVO = Email.create(data.email);
    const phoneVO = Phone.create(data.phone ?? null);

    // business check: existing email
    const exists = await this.userRepo.findByEmail(emailVO.getValue());
    if (exists) {
      const err: any = new Error('Email already in use');
      err.status = 409;
      throw err;
    }

    // role calculation
    const role = RoleAssigner.assignFromEmail(emailVO);

    // persist primitives (repository maps to Domain)
    const created = await this.userRepo.create({
      id: undefined, // repository or DB may create id; or pass an id if required
      firstName: data.firstName,
      lastName: data.lastName,
      email: emailVO.getValue(),
      phone: phoneVO.getValue(),
      role
    } as any);

    return created;
  }

  async listUsers(page = 1, pageSize = 20): Promise<DomainUser[]> {
    const skip = (page - 1) * pageSize;
    return this.userRepo.findAll(skip, pageSize);
  }

  async getUser(id: string): Promise<DomainUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return user;
  }

  async updateUser(id: string, data: UserUpdateDto): Promise<DomainUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }

    // If email change requested, check uniqueness
    if (data.email && data.email !== user.email.getValue()) {
      const other = await this.userRepo.findByEmail(data.email);
      if (other && other.id !== id) {
        const err: any = new Error('Email already in use');
        err.status = 409;
        throw err;
      }
    }

    // Mutate domain entity via its methods (encapsulation)
    if (data.firstName || data.lastName) {
      user.updateName(data.firstName, data.lastName);
    }

    if (data.phone !== undefined) {
      user.updatePhone(Phone.create(data.phone ?? null));
    }

    if (data.email && data.email !== user.email.getValue()) {
      const newEmailVO = Email.create(data.email);
      user.updateEmail(newEmailVO, (e) => RoleAssigner.assignFromEmail(e));
    }

    // Persist updated state (repo expects primitives, using toPrimitives())
    const persisted = await this.userRepo.update(id, user.toPrimitives() as any);
    return persisted;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }
    await this.userRepo.softDelete(id);
  }
}
