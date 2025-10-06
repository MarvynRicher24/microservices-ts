import { UserController } from '../../src/controllers/UserController';
import { Mediator } from '../../src/Application/CQRS/Core/Mediator';
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
  let mediatorMock: Partial<Mediator>;
  let userWithAccountsServiceMock: any;

  beforeEach(() => {
    mediatorMock = {
      send: jest.fn(),
    };
    userWithAccountsServiceMock = {
      getUserWithAccounts: jest.fn(),
    };
    // @ts-ignore
    ctrl = new UserController(mediatorMock as any, userWithAccountsServiceMock);
  });

  it('create returns 201 and json', async () => {
    const req = { body: { firstName: 'A', lastName: 'B', email: 'a@b.com' } } as any;
    const res = mockResponse();
    (mediatorMock.send as jest.Mock).mockResolvedValue({ id: '1' });

    await ctrl.create(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('list calls mediator and returns json', async () => {
    const req = { query: {} } as any;
    const res = mockResponse();
    (mediatorMock.send as jest.Mock).mockResolvedValue([{ id: '1' }]);
    await ctrl.list(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
  });

  it('delete returns 204', async () => {
    const req = { params: { id: '1' } } as any;
    const res = mockResponse();
    (mediatorMock.send as jest.Mock).mockResolvedValue(undefined);
    await ctrl.delete(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
