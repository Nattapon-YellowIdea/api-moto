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
import registerServiceRouter from '../../src/routes/app/register-service.js';
import formServiceRouter from '../../src/routes/app/form-service.js';

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

server.use('/api/register-service', registerServiceRouter);
server.use('/api/form-service', formServiceRouter);

connectMongoDB
  .then(() => {
    logger.info('MongoDB connected successfully');
    server.listen(3000, process.env.HOST);
  })
  .catch((err) => {
    logger.error(err);
    Sentry.captureException(err);
  });
