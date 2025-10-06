import { CreateUserUseCase } from '../../src/Application/UseCases/CreateUserUseCase';
import { IUserRepositoryPort } from '../../src/Application/Ports/IUserRepositoryPort';

describe('CreateUserUseCase', () => {
  it('creates user and assigns ADMIN for company.com', async () => {
    const repoMock: Partial<IUserRepositoryPort> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (p)=> {
        // simulate repo returning domain entity (simplify)
        return {
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone,
          role: p.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any;
      })
    };

    const uc = new CreateUserUseCase(repoMock as any);
    const out = await uc.execute({ firstName: 'A', lastName: 'B', email: 'a@company.com' });
    expect((repoMock.findByEmail as any)).toHaveBeenCalledWith('a@company.com');
    expect(out.role).toBe('ADMIN');
  });

  it('throws 409 if email exists', async () => {
    const repoMock: Partial<IUserRepositoryPort> = {
      findByEmail: jest.fn().mockResolvedValue({ id: '2', email: 'x@x.com' } as any)
    };
    const uc = new CreateUserUseCase(repoMock as any);
    await expect(uc.execute({ firstName: 'X', lastName: 'Y', email: 'x@x.com' })).rejects.toMatchObject({ status: 409 });
  });
});
