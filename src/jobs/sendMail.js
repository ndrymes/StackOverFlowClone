const rabbitMq = require('../libs/RabbitMq');
const cron = require('node-cron');
const SendMail = require('../utils/sendMail');
const QUEUE_NAME = 'SUBSCRIBER';

cron.schedule('*/1 * * * *', async () => {
  let data = await rabbitMq.rabbit_receive(QUEUE_NAME);
  data = JSON.parse(data);
  const user = data.data.map(user => user.email);
  await SendMail(
    user,
    'stack',
    'answers',
    `The question you subscribed to ${data.question} was answered, This is the answer ${data.answer.description}`
  );
});
module.exports = cron;
