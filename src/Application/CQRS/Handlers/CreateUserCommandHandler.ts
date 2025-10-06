
import { IHandler } from '../Core/Mediator';
import { CreateUserCommand } from '../Commands/CreateUserCommand';
import { IUserRepositoryPort } from '../../Ports/IUserRepositoryPort';
import { UserInputDto } from '../../DTOs/UserInputDto';
import { toUserOutputDto } from '../../Mapping/UserMapper';
import { Email } from '../../../Domain/ValueObjects/Email';
import { Phone } from '../../../Domain/ValueObjects/Phone';
import { RoleAssigner } from '../../../Domain/Services/RoleAssigner';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../Domain/Entities/User';
import { userAccountSagaService } from '../../../services';

export class CreateUserCommandHandler implements IHandler<CreateUserCommand, any> {
  constructor(private userRepo: IUserRepositoryPort) {}

  async handle(cmd: CreateUserCommand) {
    // Orchestration Saga : création utilisateur + compte
    const emailVO = Email.create(cmd.email);
    const phoneVO = Phone.create(cmd.phone ?? null);
  const role = RoleAssigner.assignFromEmail(emailVO);
    const id = uuidv4();
    const user = User.create({
      id,
      firstName: cmd.firstName,
      lastName: cmd.lastName,
      email: emailVO,
      phone: phoneVO,
      role
    });

    // Fonction pour créer l'utilisateur (utilisée par le Saga)
    const createUserFn = async () => {
      const persisted = await this.userRepo.create(user.toPrimitives());
      return toUserOutputDto(persisted);
    };

    // Appel du Saga orchestrateur
    return userAccountSagaService.createUserAndAccount(
      {
        firstName: cmd.firstName,
        lastName: cmd.lastName,
        email: cmd.email,
        phone: cmd.phone ?? null
      },
      createUserFn
    );
  }
}
