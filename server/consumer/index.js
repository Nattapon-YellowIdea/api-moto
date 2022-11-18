import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import connectMongoDB from '../../src/config/mongodb.js';
import sentry from '../../src/config/sentry.js';
import logger from '../../src/config/winston.js';
import connectRabbitMQ from '../../src/config/amqp.js';
import follow from '../../src/workers/consumer/line/follow.js';
import unfollow from '../../src/workers/consumer/line/unfollow.js';
import message from '../../src/workers/consumer/line/message.js';
import postback from '../../src/workers/consumer/line/postback.js';
import agentChat from '../../src/workers/consumer/bot/agent-chat.js';
import registerService from '../../src/workers/consumer/nt/register-service.js';
import topup from '../../src/workers/consumer/nt/topup.js';
import opm from '../../src/workers/consumer/nt/opm.js';

logger.info('Log Version 1.0.3');

const server = express();
server.use(bodyParser.json());

global.amqpConn = null;

const consume = (channel, exchange, rountingKey, fn) => {
  channel.assertExchange(exchange, 'direct', {
    durable: true,
  });

  const q = channel.assertQueue(`${exchange}-${rountingKey}`, { durable: true });

  channel.bindQueue(q.queue, exchange, rountingKey);

  channel.prefetch(10);

  channel.consume(q.queue, (msg) => {
    fn(msg)
      .then(() => {
        channel.ack(msg);
      })
      .catch((err) => {
        logger.error(err);
        channel.ack(msg);
        sentry.captureException(err);
      });
  }, {
    noAck: false,
  });
};

connectRabbitMQ.then(() => {
  logger.info('RabbitMQ connected successfully');
  global.amqpConn.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    consume(channel, 'line', 'follow', follow);
    consume(channel, 'line', 'unfollow', unfollow);
    consume(channel, 'line', 'message', message);
    consume(channel, 'line', 'postback', postback);
    consume(channel, 'bot', 'agent-chat', agentChat);
    consume(channel, 'register-service', 'noti-payment', registerService);
    consume(channel, 'topup', 'noti-payment', topup);
    consume(channel, 'opm', 'noti-payment', opm);
  });
}).catch((err) => {
  logger.error(err);
  sentry.captureException(err);
});

connectMongoDB
  .then(() => {
    logger.info('MongoDB connected successfully');
    server.listen(3003, process.env.HOST);
  })
  .catch((err) => {
    logger.error(err);
    sentry.captureException(err);
  });
