
import { IRequest } from '../Core/Mediator';

export class CreateUserCommand implements IRequest {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone?: string
  ) {}
}
