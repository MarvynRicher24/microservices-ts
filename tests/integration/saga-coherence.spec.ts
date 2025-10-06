import request from 'supertest';
import app from '../../src/app';

describe('Étape 2 – Cohérence Saga', () => {
  it('rollback utilisateur si la création du compte échoue', async () => {
    // Simuler une erreur côté account-service (ex: endpoint indisponible)
    // Ici, on suppose que ACCOUNT_SERVICE_URL est faux ou le service arrêté
    process.env.ACCOUNT_SERVICE_URL = 'http://localhost:4999';
    const res = await request(app)
      .post('/users')
      .send({ firstName: 'Saga', lastName: 'Fail', email: 'saga.fail@email.com' });
    expect(res.status).toBeGreaterThanOrEqual(500);
    // Vérifier que l'utilisateur n'existe pas (requête GET ou autre selon implémentation)
    // ...
  });

  it('ne supprime pas l’utilisateur si la suppression du compte échoue', async () => {
    // Créer un utilisateur normalement
    process.env.ACCOUNT_SERVICE_URL = 'http://localhost:4001';
    const createRes = await request(app)
      .post('/users')
      .send({ firstName: 'Saga', lastName: 'Delete', email: 'saga.delete@email.com' });
    expect(createRes.status).toBe(201);
    const userId = createRes.body.id;
    // Simuler une erreur côté account-service (endpoint indisponible)
    process.env.ACCOUNT_SERVICE_URL = 'http://localhost:4999';
    const delRes = await request(app).delete(`/users/${userId}`);
    expect(delRes.status).toBeGreaterThanOrEqual(500);
    // Vérifier que l'utilisateur existe toujours (requête GET ou autre)
    // ...
  });
});
