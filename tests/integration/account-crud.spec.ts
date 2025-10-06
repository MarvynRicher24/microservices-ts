import request from 'supertest';

const ACCOUNT_SERVICE_URL = process.env.ACCOUNT_SERVICE_URL || 'http://localhost:4001';

describe('Étape 1 – Microservice CompteBancaire', () => {
  let accountId: string;
  const userId = 'test-user';

  it('crée un compte bancaire (POST /accounts)', async () => {
    const res = await request(ACCOUNT_SERVICE_URL)
      .post('/accounts')
      .send({ userId, iban: 'FR761234567899', balance: 100 });
    expect(res.status).toBe(201);
    // Pour le mock, on ne récupère pas forcément l’id, mais on vérifie le message
    expect(res.body).toHaveProperty('message');
  });

  it('supprime un compte bancaire (DELETE /accounts/:id)', async () => {
    // Pour le mock, on supprime un compte existant
    const res = await request(ACCOUNT_SERVICE_URL).delete('/accounts/acc1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
