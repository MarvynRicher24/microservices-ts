// src/interfaces/IUserService.ts
import { User } from '../Domain/Entities/User';
import { UserInputDto } from '../Application/DTOs/UserInputDto';
import { UserUpdateDto } from '../Application/DTOs/UserUpdateDto';

export interface IUserService {
  createUser(data: UserInputDto): Promise<User>;
  listUsers(page?: number, pageSize?: number): Promise<User[]>;
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: UserUpdateDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
