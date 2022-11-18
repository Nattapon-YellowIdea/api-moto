import basicAuth from 'express-basic-auth';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectMongoDB from '../../src/config/mongodb.js';
import sentry from '../../src/config/sentry.js';
import logger from '../../src/config/winston.js';
import userRouter from '../../src/routes/cms/user.js';
import RegisterServiceRouter from '../../src/routes/cms/register-service.js';
import WorkingTimeRouter from '../../src/routes/cms/working-time.js';
import TermAndConditionRouter from '../../src/routes/cms/term-and-condition.js';
import TopuoRouter from '../../src/routes/cms/topup.js';
import ReportRouter from '../../src/routes/cms/report.js';
import UploadImageRouter from '../../src/routes/cms/uploadImage.js';

const server = express();
server.use(cors());
server.use(bodyParser.json({ limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DOCUMENT PROJECT NT',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/cms/*.js'], // files containing annotations as above
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

server.use('/api/cms/user', userRouter);
server.use('/api/cms/register-service', RegisterServiceRouter);
server.use('/api/cms/working-time', WorkingTimeRouter);
server.use('/api/cms/term-and-condition', TermAndConditionRouter);
server.use('/api/cms/topup', TopuoRouter);
server.use('/api/cms/report', ReportRouter);
server.use('/api/cms/upload', UploadImageRouter);

connectMongoDB
  .then(() => {
    logger.info('MongoDB connected successfully');
    server.listen(3001, process.env.HOST);
  })
  .catch((err) => {
    logger.error(err);
    sentry.captureException(err);
  });
