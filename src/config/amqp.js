import amqp from 'amqplib/callback_api.js';

export default new Promise((resolve, reject) => {
  const protocal = process.env.MQ_PROTOCAL;
  const host = process.env.MQ_HOST;
  const username = process.env.MQ_USERNAME;
  const password = process.env.MQ_PASSWORD;
  const amqpServer = `${protocal}://${username}:${password}@${host}`;
  amqp.connect(amqpServer, (err, connection) => {
    if (err) {
      reject(err.message);
    }

    global.amqpConn = connection;
    resolve(true);
  });
});
