
import { CreateUserCommand } from '../../src/Application/CQRS/Commands/CreateUserCommand';
import { CreateUserCommandHandler } from '../../src/Application/CQRS/Handlers/CreateUserCommandHandler';

describe('CreateUserCommandHandler', () => {
  it('should create a user and return output dto', async () => {
    const fakeRepo: any = {
      create: jest.fn().mockImplementation(async (data: any) => ({
        toPrimitives: () => ({
          id: '123',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        })
      }))
    };

    const handler = new CreateUserCommandHandler(fakeRepo);
    const cmd = new CreateUserCommand('John', 'Doe', 'john@example.com', '1234567890');
    const result = await handler.handle(cmd);

    expect(fakeRepo.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', '123');
    expect(result).toHaveProperty('email', 'john@example.com');
  });
});
