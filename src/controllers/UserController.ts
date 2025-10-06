
import { Request, Response, NextFunction } from 'express';
import { Mediator } from '../Application/CQRS/Core/Mediator';
import { CreateUserCommand } from '../Application/CQRS/Commands/CreateUserCommand';
import { GetUserQuery } from '../Application/CQRS/Queries/GetUserQuery';
import { ListUsersQuery } from '../Application/CQRS/Queries/ListUsersQuery';
import { UpdateUserCommand } from '../Application/CQRS/Commands/UpdateUserCommand';
import { DeleteUserCommand } from '../Application/CQRS/Commands/DeleteUserCommand';
import { UserInputDto } from '../Application/DTOs/UserInputDto';

import { UserWithAccountsService } from '../services/UserWithAccountsService';
export class UserController {
  constructor(private mediator: Mediator, private userWithAccountsService: UserWithAccountsService) {}
  getUserWithAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await this.userWithAccountsService.getUserWithAccounts(id);
      return res.json(result);
    } catch (err: any) {
      return next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: UserInputDto = req.body;
      const cmd = new CreateUserCommand(
        body.firstName,
        body.lastName,
        body.email,
        body.phone === null ? undefined : body.phone
      );
      const result = await this.mediator.send(cmd);
      return res.status(201).json(result);
    } catch (err: any) {
      return next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;
      const query = new ListUsersQuery(page, pageSize);
      const result = await this.mediator.send(query);
      return res.json(result);
    } catch (err: any) {
      return next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const query = new GetUserQuery(id);
      const result = await this.mediator.send(query);
      if (!result) return res.status(404).json({ message: 'User not found' });
      return res.json(result);
    } catch (err: any) {
      return next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const cmd = new UpdateUserCommand(id, data);
      const result = await this.mediator.send(cmd);
      return res.json(result);
    } catch (err: any) {
      return next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const cmd = new DeleteUserCommand(id);
      await this.mediator.send(cmd);
      return res.status(204).send();
    } catch (err: any) {
      return next(err);
    }
  };
}
