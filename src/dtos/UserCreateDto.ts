export interface UserCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}
