
import { IRequest } from '../Core/Mediator';

export class UpdateUserCommand implements IRequest {
  constructor(public id: string, public data: any) {}
}
