import axios from 'axios';
import { UserInputDto } from '../Application/DTOs/UserInputDto';
import { UserUpdateDto } from '../Application/DTOs/UserUpdateDto';

export class UserAccountSagaService {
  private accountServiceUrl = process.env.ACCOUNT_SERVICE_URL || 'http://localhost:4001';

  async createUserAndAccount(userInput: UserInputDto, createUserFn: (input: UserInputDto) => Promise<any>) {
    // 1. Créer l'utilisateur localement
    const user = await createUserFn(userInput);
    try {
      // 2. Créer le compte dans account-service
      await axios.post(`${this.accountServiceUrl}/accounts`, { userId: user.id, email: user.email });
      return user;
    } catch (err) {
      // 3. Si échec, rollback utilisateur (suppression directe)
      try {
        await axios.delete(`${this.accountServiceUrl}/users/${user.id}`);
      } catch {}
      throw new Error('Account creation failed, user rolled back');
    }
  }

  async deleteUserAndAccount(userId: string, deleteUserFn: (id: string) => Promise<any>) {
    // 1. Supprimer le compte dans account-service
    try {
      await axios.delete(`${this.accountServiceUrl}/accounts/${userId}`);
    } catch (err) {
      throw new Error('Account deletion failed, user not deleted');
    }
    // 2. Supprimer l'utilisateur localement
    await deleteUserFn(userId);
  }
}
