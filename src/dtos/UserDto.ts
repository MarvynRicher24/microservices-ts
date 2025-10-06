export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}
