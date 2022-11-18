import basicAuth from 'express-basic-auth';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectMongoDB from '../../src/config/mongodb.js';
import logger from '../../src/config/winston.js';
import Sentry from '../../src/config/sentry.js';
import userRouter from '../../src/routes/app/user.js';
import trackStatusRouter from '../../src/routes/app/track-status.js';
import registerServiceRouter from '../../src/routes/app/register-service.js';
import eServiceRouter from '../../src/routes/app/e-service.js';
import eServiceExternalRouter from '../../src/routes/app/external/e-service-external.js';
import fttxExternalRouter from '../../src/routes/app/external/fttx-external.js';
import scomExternalRouter from '../../src/routes/app/external/scom-external.js';
import crmExternalRouter from '../../src/routes/app/external/crm-external.js';
import opmExternalRouter from '../../src/routes/app/external/opm-external.js';
import TermAndCondition from '../../src/routes/app/term-and-condition.js';
import reportProblemRouter from '../../src/routes/app/report-problem.js';
import topupRouter from '../../src/routes/app/top-up.js';
import wsscomsExternalRouter from '../../src/routes/app/external/wsscoms-external.js';

const server = express();
server.use(cors());
server.use(bodyParser.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DOCUMENT PROJECT NT Edit',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/app/*.js', './src/routes/app/external/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

server.use('/api-docs', basicAuth({
  authorizer: (username, password) => {
    const userMatches = basicAuth.safeCompare(username, process.env.SWAGGER_USERNAME);
    const passwordMatches = basicAuth.safeCompare(password, process.env.SWAGGER_PASSWORD);
    return userMatches && passwordMatches;
  },
  challenge: true,
}), swaggerUi.serve, swaggerUi.setup(openapiSpecification));

server.use('/api/user', userRouter);
server.use('/api/track-status', trackStatusRouter);
server.use('/api/register-service', registerServiceRouter);
server.use('/api/e-service', eServiceRouter);
server.use('/api/e-service-external', eServiceExternalRouter);
server.use('/api/fttx-external', fttxExternalRouter);
server.use('/api/scom-external', scomExternalRouter);
server.use('/api/crm-external', crmExternalRouter);
server.use('/api/term-and-condition', TermAndCondition);
server.use('/api/opm-external', opmExternalRouter);
server.use('/api/report-problem', reportProblemRouter);
server.use('/api/top-up', topupRouter);
server.use('/api/wsscoms-external', wsscomsExternalRouter);

connectMongoDB
  .then(() => {
    logger.info('MongoDB connected successfully');
    server.listen(3000, process.env.HOST);
  })
  .catch((err) => {
    logger.error(err);
    Sentry.captureException(err);
  });
