import { User as DomainUser } from '../../Domain/Entities/User';
import { UserOutputDto } from '../DTOs/UserOutputDto';
import { UserInputDto } from '../DTOs/UserInputDto';

/** Domain -> Output DTO */
export function toUserOutputDto(user: DomainUser): UserOutputDto {
  const p = user.toPrimitives();
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone ?? null,
    role: p.role as 'ADMIN' | 'USER',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
}

/** Input DTO -> primitives usable to create domain entity (but prefer creating VOs in UseCase) */
export function inputDtoToPrimitives(dto: UserInputDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone ?? null
  };
}
