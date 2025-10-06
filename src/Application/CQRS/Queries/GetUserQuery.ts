
import { IRequest } from '../Core/Mediator';

export class GetUserQuery implements IRequest {
  constructor(public id: string) {}
}
