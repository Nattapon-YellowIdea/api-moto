import express from 'express';
import amqp from 'amqplib/callback_api.js';
import sentry from '../../config/sentry.js';
import logger from '../../config/winston.js';

const router = express.Router();

router.post('/line-noti', (req, res) => {
  try {
    logger.info('===== LINE NOTI AFTER TOP UP OPM UPDATE AMOUNT ===== \n');
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

        const exchange = 'opm';
        channel.assertExchange(exchange, 'direct', {
          durable: true,
        });

        channel.publish(exchange, 'noti-payment', Buffer.from(JSON.stringify(req.body)));
      });
      setTimeout(() => {
        connection.close();
      }, 500);
    });

    res.status(200).json({ status: 'success', message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
  }
});

export default router;
