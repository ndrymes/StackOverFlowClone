const amqplib = require('amqplib');
const config = require('../config/index');
const RABBIT_HOST = config.RABBITMQ.RABBIT_HOST;
const RABBIT_PORT = config.RABBITMQ.RABBIT_PORT;
const RABBIT_USERNAME = config.RABBITMQ.RABBIT_USERNAME;
const RABBIT_PASSWORD = config.RABBITMQ.RABBIT_PASSWORD;

const client = amqplib.connect(
  `amqp://${RABBIT_USERNAME}:${RABBIT_PASSWORD}@${RABBIT_HOST}/${RABBIT_USERNAME}`
);
module.exports = client;
