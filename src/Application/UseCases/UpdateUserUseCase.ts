import { IUserRepositoryPort } from '../Ports/IUserRepositoryPort';
import { UserUpdateDto } from '../DTOs/UserUpdateDto';
import { Email } from '../../Domain/ValueObjects/Email';
import { Phone } from '../../Domain/ValueObjects/Phone';
import { RoleAssigner } from '../../Domain/Services/RoleAssigner';
import { toUserOutputDto } from '../Mapping/UserMapper';

export class UpdateUserUseCase {
  constructor(private userRepo: IUserRepositoryPort) {}

  async execute(id: string, dto: UserUpdateDto) {
    const user = await this.userRepo.findById(id);
    if (!user) { const e: any = new Error('User not found'); e.status = 404; throw e; }

    if (dto.email && dto.email !== user.email.getValue()) {
      const other = await this.userRepo.findByEmail(dto.email);
      if (other && other.id !== id) { const e: any = new Error('Email already in use'); e.status = 409; throw e; }
    }

    if (dto.firstName || dto.lastName) user.updateName(dto.firstName, dto.lastName);
    if (dto.phone) user.updatePhone(Phone.create(dto.phone));
    if (dto.email && dto.email !== user.email.getValue()) {
      const newEmail = Email.create(dto.email);
      user.updateEmail(newEmail, e => RoleAssigner.assignFromEmail(e));
    }

    const persisted = await this.userRepo.update(id, user.toPrimitives());
    return toUserOutputDto(persisted);
  }
}
