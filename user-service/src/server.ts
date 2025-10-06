import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Endpoints CRUD Utilisateur
app.post('/users', (req, res) => {
  // TODO: Ajouter la logique de création d'utilisateur
  res.status(201).json({ message: 'Utilisateur créé' });
});

app.delete('/users/:id', (req, res) => {
  // TODO: Ajouter la logique de suppression d'utilisateur
  res.status(200).json({ message: `Utilisateur ${req.params.id} supprimé` });
});

// Autres endpoints CRUD à ajouter ici

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
