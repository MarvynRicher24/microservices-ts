// Consumer RabbitMQ d'exemple pour logs
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'microservices_events';

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  // Consomme tous les événements
  await channel.bindQueue(q.queue, EXCHANGE, 'account.*');
  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`[RabbitMQ] Event: ${msg.fields.routingKey} -`, msg.content.toString());
    }
  }, { noAck: true });
  console.log('RabbitMQ consumer started. Listening for account.* events...');
}

startConsumer().catch(console.error);
