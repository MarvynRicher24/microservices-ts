import { IUserRepositoryPort } from '../Ports/IUserRepositoryPort';
import { toUserOutputDto } from '../Mapping/UserMapper';

export class GetUserUseCase {
  constructor(private userRepo: IUserRepositoryPort) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const err: any = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return toUserOutputDto(user);
  }
}
