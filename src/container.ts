import { UserWithAccountsService } from './services/UserWithAccountsService';
import { createContainer, asClass, asValue, AwilixContainer } from 'awilix';
import { PrismaUserRepository } from './Infrastructure/Persistence/PrismaUserRepository';
import { PrismaUnitOfWork } from './Infrastructure/Persistence/PrismaUnitOfWork';
import { prisma } from './prisma/client';
import { UserController } from './controllers/UserController';

// CQRS Mediator & Handlers
import { Mediator } from './Application/CQRS/Core/Mediator';
import { CreateUserCommandHandler } from './Application/CQRS/Handlers/CreateUserCommandHandler';
import { GetUserQueryHandler } from './Application/CQRS/Handlers/GetUserQueryHandler';
import { ListUsersQueryHandler } from './Application/CQRS/Handlers/ListUsersQueryHandler';
import { UpdateUserCommandHandler } from './Application/CQRS/Handlers/UpdateUserCommandHandler';
import { DeleteUserCommandHandler } from './Application/CQRS/Handlers/DeleteUserCommandHandler';

export const container: AwilixContainer = createContainer();

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
