
import { GetUserQuery } from '../../src/Application/CQRS/Queries/GetUserQuery';
import { GetUserQueryHandler } from '../../src/Application/CQRS/Handlers/GetUserQueryHandler';

describe('GetUserQueryHandler', () => {
  it('should return user dto when found', async () => {
    const fakeRepo: any = {
      findById: jest.fn().mockImplementation(async (id: string) => ({
        toPrimitives: () => ({
          id: id,
          firstName: 'Jane',
          lastName: 'Roe',
          email: 'jane@example.com',
          phone: null,
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        })
      }))
    };

    const handler = new GetUserQueryHandler(fakeRepo);
    const q = new GetUserQuery('abc');
    const result = await handler.handle(q);

    expect(fakeRepo.findById).toHaveBeenCalledWith('abc');
    expect(result).toHaveProperty('email', 'jane@example.com');
    expect(result).toHaveProperty('role', 'ADMIN');
  });
});
