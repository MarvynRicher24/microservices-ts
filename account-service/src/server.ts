import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Stockage en mémoire pour les comptes bancaires (exemple)
const accountsDb: any[] = [
  { id: 'acc1', userId: 'user1', iban: 'FR761234567890', balance: 1000 },
  { id: 'acc2', userId: 'user1', iban: 'FR761234567891', balance: 500 },
  { id: 'acc3', userId: 'user2', iban: 'FR761234567892', balance: 200 },
];

// Endpoint pour récupérer les comptes d'un utilisateur
app.get('/accounts', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  const accounts = accountsDb.filter(acc => acc.userId === userId);
  res.json(accounts);
});

// Endpoints CRUD CompteBancaire
app.post('/accounts', (req, res) => {
  // TODO: Ajouter la logique de création de compte bancaire
  res.status(201).json({ message: 'Compte bancaire créé' });
});

app.delete('/accounts/:id', (req, res) => {
  // TODO: Ajouter la logique de suppression de compte bancaire
  res.status(200).json({ message: `Compte bancaire ${req.params.id} supprimé` });
});

// Autres endpoints CRUD à ajouter ici

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Account Service running on port ${PORT}`);
});
