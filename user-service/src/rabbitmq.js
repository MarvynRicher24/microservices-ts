// Utilitaire RabbitMQ pour publier des événements
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'microservices_events';

async function publishEvent(eventType, payload) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: false });
  channel.publish(EXCHANGE, eventType, Buffer.from(JSON.stringify(payload)));
  setTimeout(() => {
    channel.close();
    conn.close();
  }, 500);
}

module.exports = { publishEvent };
