import { IUserRepositoryPort } from '../Ports/IUserRepositoryPort';
import { toUserOutputDto } from '../Mapping/UserMapper';

export class ListUsersUseCase {
  constructor(private userRepo: IUserRepositoryPort) {}

  async execute(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const users = await this.userRepo.findAll(skip, pageSize);
    return users.map(toUserOutputDto);
  }
}
