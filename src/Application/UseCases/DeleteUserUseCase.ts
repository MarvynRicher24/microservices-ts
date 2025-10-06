import { IUserRepositoryPort } from '../Ports/IUserRepositoryPort';

export class DeleteUserUseCase {
  constructor(private userRepo: IUserRepositoryPort) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) { const e: any = new Error('User not found'); e.status = 404; throw e; }
    await this.userRepo.softDelete(id);
    return; // void -> controller returns 204
  }
}
