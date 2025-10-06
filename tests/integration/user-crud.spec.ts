import request from 'supertest';
import app from '../../src/app';

describe('Étape 1 – Microservice Utilisateur', () => {
  let userId: string;

  it('crée un utilisateur (POST /users)', async () => {
    const res = await request(app)
      .post('/users')
      .send({ firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstName).toBe('Jean');
    userId = res.body.id;
  });

  it('supprime un utilisateur (DELETE /users/:id)', async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.status).toBe(204);
  });
});
