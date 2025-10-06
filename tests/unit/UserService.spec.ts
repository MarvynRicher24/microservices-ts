import { UserService } from '../../src/services/UserService';
import { IUserRepository } from '../../src/interfaces/IUserRepository';
import { UserCreateDto } from '../../src/dtos/UserCreateDto';

describe('UserService - unit', () => {
  let service: UserService;
  let repoMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repoMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn()
    };
    service = new UserService(repoMock as any);
  });

  it('creates user and assigns ADMIN role for company.com', async () => {
    const dto: UserCreateDto = { firstName: 'John', lastName: 'Doe', email: 'john@company.com' };
    repoMock.findByEmail.mockResolvedValue(null as any);
    repoMock.create.mockImplementation(async (data: any) => ({ id: '1', ...data, createdAt: new Date(), updatedAt: new Date() }));

    const created = await service.createUser(dto);
    expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(repoMock.create).toHaveBeenCalled();
    expect(created.role).toBe('ADMIN');
  });

  it('throws 409 if email already exists', async () => {
    const dto: UserCreateDto = { firstName: 'Jane', lastName: 'X', email: 'jane@x.com' };
    repoMock.findByEmail.mockResolvedValue({ id: '2', email: dto.email } as any);

    await expect(service.createUser(dto)).rejects.toMatchObject({ status: 409 });
    expect(repoMock.create).not.toHaveBeenCalled();
  });

  it('lists users with pagination', async () => {
    repoMock.findAll.mockResolvedValue([{ id: '1' } as any]);
    const users = await service.listUsers(2, 10);
    // skip = (page-1)*pageSize -> 10
    expect(repoMock.findAll).toHaveBeenCalledWith(10, 10);
  });

  it('updateUser throws 404 if not exists', async () => {
    repoMock.findById.mockResolvedValue(null);
    await expect(service.updateUser('nope', {})).rejects.toMatchObject({ status: 404 });
  });

  it('deleteUser soft deletes', async () => {
    repoMock.findById.mockResolvedValue({ id: '1' } as any);
    repoMock.softDelete.mockResolvedValue({ id: '1', deletedAt: new Date() } as any);
    await expect(service.deleteUser('1')).resolves.toBeUndefined();
    expect(repoMock.softDelete).toHaveBeenCalledWith('1');
  });
});
