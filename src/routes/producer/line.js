import express from 'express';
import amqp from 'amqplib/callback_api.js';
import sentry from '../../config/sentry.js';
import logger from '../../config/winston.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    logger.info('===== LINE WEBHOOK ===== \n');
    logger.info(req.body);

    const protocal = process.env.MQ_PROTOCAL;
    const host = process.env.MQ_HOST;
    const username = process.env.MQ_USERNAME;
    const password = process.env.MQ_PASSWORD;
    const amqpServer = `${protocal}://${username}:${password}@${host}`;

    amqp.connect(amqpServer, (errConn, connection) => {
      if (errConn) {
        logger.error(errConn);
      }

      connection.createChannel((err, channel) => {
        if (err) {
          throw err;
        }

        const exchange = 'line';
        channel.assertExchange(exchange, 'direct', {
          durable: true,
        });

        req.body.events.forEach((event) => {
          channel.publish(exchange, event.type, Buffer.from(JSON.stringify(req.body)));
        });
      });
      setTimeout(() => {
        connection.close();
      }, 500);
    });
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
  }
});

export default router;
