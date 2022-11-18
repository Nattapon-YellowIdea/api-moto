import express from 'express';
import amqp from 'amqplib/callback_api.js';
import sentry from '../../config/sentry.js';
import logger from '../../config/winston.js';
import botController from '../../controllers/bot.controller.js';

const router = express.Router();

router.post('/agent-chat', (req, res) => {
  try {
    logger.info('===== AGENT END CHAT ===== \n');
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

        const exchange = 'bot';
        channel.assertExchange(exchange, 'direct', {
          durable: true,
        });

        channel.publish(exchange, 'agent-chat', Buffer.from(JSON.stringify(req.body)));
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

router.post('/end-agent-chat', botController.endAgentChat);

export default router;
