import request from 'supertest';
import app from '../../src/app';

describe('Étape 3 – Requête agrégée', () => {
  let userId: string;

  beforeAll(async () => {
    // Créer un utilisateur pour le test
    const res = await request(app)
      .post('/users')
      .send({ firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@email.com' });
    userId = res.body.id;
  });

  it('retourne le nom, prénom et comptes bancaires (GET /users/:id/with-accounts)', async () => {
    const res = await request(app).get(`/users/${userId}/with-accounts`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName');
    expect(res.body).toHaveProperty('lastName');
    expect(res.body).toHaveProperty('accounts');
    expect(Array.isArray(res.body.accounts)).toBe(true);
  });
});
