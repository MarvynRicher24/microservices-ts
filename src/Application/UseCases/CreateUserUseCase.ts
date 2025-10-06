import { IUserRepositoryPort } from '../Ports/IUserRepositoryPort';
import { UserInputDto } from '../DTOs/UserInputDto';
import { Email } from '../../Domain/ValueObjects/Email';
import { Phone } from '../../Domain/ValueObjects/Phone';
import { RoleAssigner } from '../../Domain/Services/RoleAssigner';
import { User } from '../../Domain/Entities/User';
import { v4 as uuidv4 } from 'uuid';
import { toUserOutputDto } from '../Mapping/UserMapper';

export class CreateUserUseCase {
  constructor(private userRepo: IUserRepositoryPort) {}

  async execute(input: UserInputDto) {
    // 1) validation basic (more complex validation can be delegated)
    const emailVO = Email.create(input.email);
    const phoneVO = Phone.create(input.phone ?? null);

    // 2) business checks
    const existing = await this.userRepo.findByEmail(emailVO.getValue());
    if (existing) {
      const err: any = new Error('Email already in use');
      err.status = 409;
      throw err;
    }

    // 3) role calc + entity creation (id generated here)
    const role = RoleAssigner.assignFromEmail(emailVO);
    const id = uuidv4();

    const user = User.create({
      id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: emailVO,
      phone: phoneVO,
      role
    });

    // 4) persistence via port (repository adapter will map to DB)
    const persisted = await this.userRepo.create(user.toPrimitives());

    // 5) map Domain -> Output DTO (persisted returned as domain entity by infra)
    return toUserOutputDto(persisted);
  }
}
