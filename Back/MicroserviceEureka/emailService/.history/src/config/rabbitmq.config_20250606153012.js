// Dans votre fichier server.js ou un nouveau fichier rabbitmq.js
const amqp = require('amqplib');

// Configuration RabbitMQ
const RABBITMQ_HOST = '161.97.88.195';
const RABBITMQ_USER = 'admin';
const RABBITMQ_PASS = 'admin';
const EXCHANGE_NAME = 'exchange.NotificationService.sendEmail';
const QUEUE_NAME = 'queue.EmailService.sendEmail';
const ROUTING_KEY = 'NotificationService.envoye.EmailService';

async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
    const channel = await connection.createChannel();

    // Changement ici : 'topic' au lieu de 'direct'
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    console.log('RabbitMQ connecté et configuré avec succès');
    return { connection, channel };
  } catch (error) {
    console.error('Erreur de configuration RabbitMQ:', error);
    throw error;
  }
}

module.exports = { setupRabbitMQ };