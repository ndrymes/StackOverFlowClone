const client = require('../db/rabbitMq');

class RabbitMQ {
  rabbit_send(QUEUE_NAME, message) {
    return new Promise((resolve, reject) => {
      client
        .then(connection => {
          return connection.createChannel();
        })
        .then(channel => {
          return channel.assertQueue(QUEUE_NAME).then(res => {
            const status = channel.sendToQueue(
              QUEUE_NAME,
              Buffer.from(message)
            );
            console.log(status);

            return resolve(status);
          });
        })
        .catch(error => {
          console.log(error);

          reject(false);
        });
    });
  }
  rabbit_receive(QUEUE_NAME) {
    return new Promise((resolve, reject) => {
      client
        .then(connection => {
          return connection.createChannel();
        })
        .then(channel => {
          return channel.assertQueue(QUEUE_NAME).then(res => {
            channel.consume(QUEUE_NAME, message => {
              if (message !== null) {
                resolve(message.content.toString());
                channel.ack(message);
              } else {
                reject('No message gotten.');
              }
            });
          });
        })
        .catch(error => {
          console.log(error);

          reject(`Unable to consume Message from the Queue.${error}`);
        });
    });
  }
}

const rabbitMQ = new RabbitMQ();
module.exports = rabbitMQ;
