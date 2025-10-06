
import { IHandler } from '../Core/Mediator';
import { GetUserQuery } from '../Queries/GetUserQuery';
import { IUserRepositoryPort } from '../../Ports/IUserRepositoryPort';
import { toUserOutputDto } from '../../Mapping/UserMapper';

export class GetUserQueryHandler implements IHandler<GetUserQuery, any> {
  constructor(private userRepo: IUserRepositoryPort) {}

  async handle(query: GetUserQuery) {
    const user = await this.userRepo.findById(query.id);
    if (!user) return null;
    return toUserOutputDto(user);
  }
}
