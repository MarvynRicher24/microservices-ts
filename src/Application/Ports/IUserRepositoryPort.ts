import { User as DomainUser } from '../../Domain/Entities/User';

export interface IUserRepositoryPort {
  create(data: any): Promise<DomainUser>;
  findAll(skip?: number, take?: number): Promise<DomainUser[]>;
  findById(id: string): Promise<DomainUser | null>;
  findByEmail(email: string): Promise<DomainUser | null>;
  update(id: string, data: any): Promise<DomainUser>;
  softDelete(id: string): Promise<DomainUser>;
}
