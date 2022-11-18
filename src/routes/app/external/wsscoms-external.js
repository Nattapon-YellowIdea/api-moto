import express from 'express';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import wsscomsExternal from '../../../external/wsscoms.js';

const router = express.Router();

/**
 * @swagger
 * /api/wsscoms-external/callback-list-web-type:
 *  post:
 *    tags: ["External WSSCOMS"]
 *    description: External WSSCOMS Service CallBackListWebType.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              callbackNumber:
 *                type: string
 *                example: '0958274889'
 *                description: callbackNumber
 *              phoneNumber:
 *                type: string
 *                example: '5361J7785'
 *                description: phoneNumber
 *              serviceType:
 *                type: string
 *                example: '006'
 *                description: serviceType
 *              reason:
 *                type: string
 *                example: '1'
 *                description: reason
 *              callName:
 *                type: string
 *                example: 'LINE Test'
 *                description: callName
 *              memo:
 *                type: string
 *                example: 'API Test'
 *                description: memo
 *              email:
 *                type: string
 *                example: 'sporxdox@gmail.com'
 *                description: email
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/callback-list-web-type', async (req, res) => {
  try {
    const payload = req.body;

    const result = await wsscomsExternal.callBackListWeb(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/wsscoms-external/get-status-by-ticket:
 *  post:
 *    tags: ["External WSSCOMS"]
 *    description: External WSSCOMS Service getStatusByTicket.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: string
 *                example: 'scoms'
 *                description: user
 *              pass:
 *                type: string
 *                example: 'scoms'
 *                description: pass
 *              ticket:
 *                type: string
 *                example: '28928080'
 *                description: ticket
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-status-by-ticket', async (req, res) => {
  try {
    const payload = req.body;

    const result = await wsscomsExternal.getStatusByTicket(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

export default router;
