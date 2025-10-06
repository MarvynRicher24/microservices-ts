
import { IHandler } from '../Core/Mediator';
import { ListUsersQuery } from '../Queries/ListUsersQuery';
import { IUserRepositoryPort } from '../../Ports/IUserRepositoryPort';
import { toUserOutputDto } from '../../Mapping/UserMapper';

export class ListUsersQueryHandler implements IHandler<ListUsersQuery, any> {
  constructor(private userRepo: IUserRepositoryPort) {}

  async handle(query: ListUsersQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const take = query.pageSize;
    const users = await this.userRepo.findAll(skip, take);
    return users.map(u => toUserOutputDto(u));
  }
}
