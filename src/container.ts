const { UserWithAccountsService } = require('./services/UserWithAccountsService');
const { createContainer, asClass, asValue } = require('awilix');
const { PrismaUserRepository } = require('./Infrastructure/Persistence/PrismaUserRepository');
const { PrismaUnitOfWork } = require('./Infrastructure/Persistence/PrismaUnitOfWork');
const { prisma } = require('./prisma/client');
const { UserController } = require('./controllers/UserController');

// CQRS Mediator & Handlers
import { Mediator } from './Application/CQRS/Core/Mediator';
import { CreateUserCommandHandler } from './Application/CQRS/Handlers/CreateUserCommandHandler';
import { GetUserQueryHandler } from './Application/CQRS/Handlers/GetUserQueryHandler';
import { ListUsersQueryHandler } from './Application/CQRS/Handlers/ListUsersQueryHandler';
import { UpdateUserCommandHandler } from './Application/CQRS/Handlers/UpdateUserCommandHandler';
import { DeleteUserCommandHandler } from './Application/CQRS/Handlers/DeleteUserCommandHandler';

const container = createContainer();

// register core infrastructure & adapters
container.register({
  prismaClient: asValue(prisma),
  unitOfWork: asClass(PrismaUnitOfWork).scoped(),
  userRepository: asClass(PrismaUserRepository).scoped(),

  // presentation
  userController: asClass(UserController).scoped(),
  userWithAccountsService: asClass(UserWithAccountsService).scoped()
});

// register CQRS handlers
container.register({
  createUserCommandHandler: asClass(CreateUserCommandHandler).scoped(),
  getUserQueryHandler: asClass(GetUserQueryHandler).scoped(),
  listUsersQueryHandler: asClass(ListUsersQueryHandler).scoped(),
  updateUserCommandHandler: asClass(UpdateUserCommandHandler).scoped(),
  deleteUserCommandHandler: asClass(DeleteUserCommandHandler).scoped(),
});

// register mediator instance that will resolve handlers from this container

container.register({ mediator: asValue(new Mediator(container)) });

module.exports = { container };
