
import { IRequest } from '../Core/Mediator';

export class DeleteUserCommand implements IRequest {
  constructor(public id: string) {}
}
