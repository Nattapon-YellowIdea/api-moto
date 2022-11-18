import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import sentry from '../../src/config/sentry.js';
import logger from '../../src/config/winston.js';
import connectMongoDB from '../../src/config/mongodb.js';
import lineRouter from '../../src/routes/producer/line.js';
import botRouter from '../../src/routes/producer/bot.js';
import opmRouter from '../../src/routes/producer/opm.js';
import RegisterServiceRouter from '../../src/routes/producer/register-service.js';
import TopupRouter from '../../src/routes/producer/topup.js';

logger.info('Log Version 1.0.4');

const server = express();
server.use(bodyParser.json());

const middleware = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ status: 401, message: 'Authorization' });
    return;
  }

  next();
};

server.use('/api/line-webhook', lineRouter);
server.use('/api/opm', opmRouter);
server.use('/api/register-service', RegisterServiceRouter);
server.use('/api/topup', TopupRouter);
server.use(middleware);
server.use('/api/bot-receive', botRouter);

connectMongoDB
  .then(() => {
    logger.info('MongoDB connected successfully');
  })
  .catch((err) => {
    logger.error(err);
    sentry.captureException(err);
  });

server.listen(3002, process.env.HOST);
