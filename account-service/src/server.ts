import express from 'express';
import bodyParser from 'body-parser';
const { publishEvent } = require('./rabbitmq');

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
  const { userId, iban, balance } = req.body;
  const account = { id: `acc${Date.now()}`, userId, iban, balance: balance || 0 };
  accountsDb.push(account);
  publishEvent('account.created', account);
  res.status(201).json(account);
});

app.delete('/accounts/:id', (req, res) => {
  const idx = accountsDb.findIndex(acc => acc.id === req.params.id);
  if (idx !== -1) {
    const acc = accountsDb[idx];
    accountsDb.splice(idx, 1);
    publishEvent('account.deleted', acc);
    res.status(200).json({ message: `Compte bancaire ${req.params.id} supprimé` });
  } else {
    res.status(404).json({ message: 'Compte non trouvé' });
  }
});


// Récupérer un compte par son ID
app.get('/accounts/:id', (req, res) => {
  const acc = accountsDb.find(acc => acc.id === req.params.id);
  if (acc) {
    res.json(acc);
  } else {
    res.status(404).json({ message: 'Compte non trouvé' });
  }
});

// Mettre à jour un compte
app.put('/accounts/:id', (req, res) => {
  const idx = accountsDb.findIndex(acc => acc.id === req.params.id);
  if (idx !== -1) {
    const { iban, balance } = req.body;
    if (iban !== undefined) accountsDb[idx].iban = iban;
    if (balance !== undefined) accountsDb[idx].balance = balance;
    publishEvent('account.updated', accountsDb[idx]);
    res.json(accountsDb[idx]);
  } else {
    res.status(404).json({ message: 'Compte non trouvé' });
  }
});


// --- RabbitMQ Consumer pour création automatique de compte à la création d'un user ---
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'microservices_events';

async function startUserConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE, 'user.created');
  channel.consume(q.queue, (msg: any) => {
    if (msg && msg.content) {
      const user = JSON.parse(msg.content.toString());
      // Création automatique d'un compte pour le nouvel utilisateur
      const account = {
        id: `acc${Date.now()}`,
        userId: user.id,
        iban: `FR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        balance: 0
      };
      accountsDb.push(account);
      publishEvent('account.created', account);
      console.log(`[AccountService] Compte auto-créé pour user ${user.id}`);
    }
  }, { noAck: true });
  console.log('RabbitMQ consumer started. Listening for user.created events...');
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Account Service running on port ${PORT}`);
  startUserConsumer().catch(console.error);
});
