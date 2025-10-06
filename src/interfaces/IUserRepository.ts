import { User } from '../Domain/Entities/User';

export interface IUserRepository {
  create(data: any): Promise<User>;
  findAll(skip?: number, take?: number): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: any): Promise<User>;
  softDelete(id: string): Promise<User>;
}
