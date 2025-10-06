import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

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
