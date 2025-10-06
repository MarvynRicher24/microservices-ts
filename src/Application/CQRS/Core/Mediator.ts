
import { AwilixContainer } from 'awilix';

export interface IRequest<TResponse = any> {}

export interface IHandler<TRequest extends IRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

export class Mediator {
  constructor(private container: AwilixContainer) {}

  private lowerFirst(s: string) {
    if (!s) return s;
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  async send<TResponse = any>(request: IRequest<TResponse>): Promise<TResponse> {
    const handlerKey = this.lowerFirst(request.constructor.name) + 'Handler';
    if (!this.container.hasRegistration(handlerKey)) {
      throw new Error(`Handler not registered for key: ${handlerKey}`);
    }
    const handler = this.container.resolve<any>(handlerKey) as IHandler<IRequest, TResponse>;
    return handler.handle(request);
  }
}
