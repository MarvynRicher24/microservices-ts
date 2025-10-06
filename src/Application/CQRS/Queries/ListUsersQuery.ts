
import { IRequest } from '../Core/Mediator';

export class ListUsersQuery implements IRequest {
  constructor(public page: number = 1, public pageSize: number = 20) {}
}
