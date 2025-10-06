// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import { UserAccountSagaService } from '../../src/services/UserAccountSagaService';
const { publishEvent } = require('./rabbitmq');

const app = express();
app.use(bodyParser.json());

// Simu stockage en mémoire pour les utilisateurs
const usersDb = [];
const saga = new UserAccountSagaService();

// Endpoint création utilisateur avec saga
app.post('/users', async (req, res) => {
  try {
    const userInput = req.body;
    // La fonction de création locale
    const createUserFn = async (input) => {
      const user = { ...input, id: `${Date.now()}` };
      usersDb.push(user);
      // Publier l'événement création utilisateur
      await publishEvent('user.created', user);
      return user;
    };
    const user = await saga.createUserAndAccount(userInput, createUserFn);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint suppression utilisateur avec saga
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUserFn = async (id) => {
      const idx = usersDb.findIndex(u => u.id === id);
      if (idx !== -1) {
        const user = usersDb[idx];
        usersDb.splice(idx, 1);
        // Publier l'événement suppression utilisateur
        await publishEvent('user.deleted', { id: userId, email: user?.email });
      }
    };
    await saga.deleteUserAndAccount(userId, deleteUserFn);
    res.status(200).json({ message: `Utilisateur ${userId} supprimé` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Autres endpoints CRUD à ajouter ici

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
