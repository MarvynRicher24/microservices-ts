import { UserController } from '../../src/controllers/UserController';
import { IUserService } from '../../src/interfaces/IUserService';
import { Request, Response } from 'express';

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('UserController - unit', () => {
  let ctrl: UserController;
  let serviceMock: Partial<IUserService>;

  beforeEach(() => {
    serviceMock = {
      createUser: jest.fn(),
      listUsers: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };
    // @ts-ignore
    ctrl = new UserController(serviceMock as any);
  });

  it('create returns 201 and json', async () => {
    const req = { body: { firstName: 'A', lastName: 'B', email: 'a@b.com' } } as any;
    const res = mockResponse();
    (serviceMock.createUser as jest.Mock).mockResolvedValue({ id: '1' });

    await ctrl.create(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('list calls service and returns json', async () => {
    const req = { query: {} } as any;
    const res = mockResponse();
    (serviceMock.listUsers as jest.Mock).mockResolvedValue([{ id: '1' }]);
    await ctrl.list(req, res, jest.fn());
    expect(res.json).toHaveBeenCalled();
  });

  it('remove returns 204', async () => {
    const req = { params: { id: '1' } } as any;
    const res = mockResponse();
    (serviceMock.deleteUser as jest.Mock).mockResolvedValue(undefined);
    await ctrl.remove(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
