import express from 'express';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import opmExternal from '../../../external/opm.js';

const router = express.Router();

/**
 * @swagger
 * /api/opm-external/verify:
 *  post:
 *    tags: ["External OPM"]
 *    description: External OPM Service verify.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              request:
 *                type: string
 *                example: 'verify'
 *                description: request
 *              user:
 *                type: string
 *                example: ''
 *                description: user
 *              password:
 *                type: string
 *                example: ''
 *                description: password
 *              tranID:
 *                type: string
 *                example: '1507211824590420'
 *                description: tranID
 *              tranDate:
 *                type: string
 *                example: '2015-05-30T18:00:00'
 *                description: tranDate
 *              channel:
 *                type: string
 *                example: 'LINE'
 *                description: channel
 *              account:
 *                type: string
 *                example: '1113060335'
 *                description: account
 *              amount:
 *                type: string
 *                example: '100.00'
 *                description: amount
 *              reference1:
 *                type: string
 *                example: ''
 *                description: reference1
 *              reference2:
 *                type: string
 *                example: ''
 *                description: reference2
 *              reference3:
 *                type: string
 *                example: ''
 *                description: reference3
 *              branchCode:
 *                type: string
 *                example: '0111'
 *                description: branchCode
 *              terminalID:
 *                type: string
 *                example: '2'
 *                description: terminalID
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/verify', async (req, res) => {
  try {
    const payload = req.body;
    const result = await opmExternal.verify(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/opm-external/get-address:
 *  post:
 *    tags: ["External OPM"]
 *    description: External OPM Service get-address.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mobile:
 *                type: string
 *                example: '0975753740'
 *                description: mobile
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-address', async (req, res) => {
  try {
    const payload = req.body;

    const result = await opmExternal.getAddress(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

export default router;
