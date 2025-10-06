import axios from 'axios';
import { IUserRepositoryPort } from '../Application/Ports/IUserRepositoryPort';

export class UserWithAccountsService {
  private accountServiceUrl = process.env.ACCOUNT_SERVICE_URL || 'http://localhost:4001';

  constructor(private userRepo: IUserRepositoryPort) {}

  async getUserWithAccounts(userId: string) {
    // 1. Récupérer l'utilisateur
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    // 2. Appeler le service de comptes
    const accounts = await this.fetchAccounts(userId);
    // 3. Retourner l'agrégat
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      accounts
    };
  }

  private async fetchAccounts(userId: string) {
    try {
      const res = await axios.get(`${this.accountServiceUrl}/accounts?userId=${userId}`);
      return res.data;
    } catch (e) {
      return [];
    }
  }
}
