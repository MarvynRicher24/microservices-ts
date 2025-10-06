
import { IHandler } from '../Core/Mediator';
import { DeleteUserCommand } from '../Commands/DeleteUserCommand';
import { IUserRepositoryPort } from '../../Ports/IUserRepositoryPort';
import { userAccountSagaService } from '../../../services';

export class DeleteUserCommandHandler implements IHandler<DeleteUserCommand, any> {
  constructor(private userRepo: IUserRepositoryPort) {}

  async handle(cmd: DeleteUserCommand) {
    // Orchestration Saga : suppression compte + utilisateur
    const deleteUserFn = async (id: string) => {
      await this.userRepo.softDelete(id);
      return null;
    };
    return userAccountSagaService.deleteUserAndAccount(cmd.id, deleteUserFn);
  }
}
