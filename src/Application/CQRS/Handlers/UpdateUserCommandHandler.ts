
import { IHandler } from '../Core/Mediator';
import { UpdateUserCommand } from '../Commands/UpdateUserCommand';
import { IUserRepositoryPort } from '../../Ports/IUserRepositoryPort';
import { toUserOutputDto } from '../../Mapping/UserMapper';

export class UpdateUserCommandHandler implements IHandler<UpdateUserCommand, any> {
  constructor(private userRepo: IUserRepositoryPort) {}

  async handle(cmd: UpdateUserCommand) {
    const updated = await this.userRepo.update(cmd.id, cmd.data);
    return toUserOutputDto(updated);
  }
}
