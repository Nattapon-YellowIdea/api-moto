import express from 'express';
import moment from 'moment-timezone';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import crmExternal from '../../../external/crm.js';

const router = express.Router();

/**
 * @swagger
 * /api/crm-external/crm-query-ca-for-all-ps:
 *  post:
 *    tags: ["External CRM"]
 *    description: External CRM Service CRM_QueryCAforAll_PS.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              cid:
 *                type: string
 *                example: '3580300151853'
 *                description: cid
 *              passport:
 *                type: string
 *                example: ''
 *                description: passport
 *              type:
 *                type: string
 *                example: 'cid'
 *                description: 1 IsCitizenId, 2 passcode
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/crm-query-ca-for-all-ps', async (req, res) => {
  try {
    const payload = req.body;
    const datenow = moment.tz(new Date(), 'Asia/Bangkok');
    datenow.add(543, 'years');

    const payloadcrmQueryCaForAllPs = {
      personalId: (payload.type === 'cid') ? payload.cid : payload.passport,
      transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
      integrationKeyRef: 'LINEAPP',
      IsCitizenId: (payload.type === 'cid') ? 1 : 2,
    };
    const result = await crmExternal.crmQueryCaForAllPs(payloadcrmQueryCaForAllPs);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/crm-external/crm-query-ba-ps:
 *  post:
 *    tags: ["External CRM"]
 *    description: External CRM Service CRM_QueryBA_PS.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              transactionId:
 *                type: string
 *                example: 'LINEAPP25650823103540'
 *                description: transactionId
 *              integrationKeyRef:
 *                type: string
 *                example: 'LINEAPP'
 *                description: integrationKeyRef
 *              billingAccountId:
 *                type: string
 *                example: '199027849281'
 *                description: billingAccountId
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/crm-query-ba-ps', async (req, res) => {
  try {
    const payload = req.body;

    const result = await crmExternal.crmQueryBaPs(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/crm-external/crm-query-bill-summary-for-lastest-dept-ps:
 *  post:
 *    tags: ["External CRM"]
 *    description: External CRM Service CRM_QueryBillSummaryForLatestDebt_PS.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              transactionId:
 *                type: string
 *                example: 'LINEAPP25650823103540'
 *                description: transactionId
 *              integrationKeyRef:
 *                type: string
 *                example: 'LINEAPP'
 *                description: integrationKeyRef
 *              accountNum:
 *                type: string
 *                example: '000113358038'
 *                description: accountNum
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/crm-query-bill-summary-for-lastest-dept-ps', async (req, res) => {
  try {
    const payload = req.body;

    const result = await crmExternal.crmQueryBillSummaryForLatestDebtPS(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/crm-external/crm-query-all-invoice-ps:
 *  post:
 *    tags: ["External CRM"]
 *    description: External CRM Service CRM_queryAllInvoice.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              transactionId:
 *                type: string
 *                example: 'LINEAPP25650823103540'
 *                description: transactionId
 *              integrationKeyRef:
 *                type: string
 *                example: 'LINEAPP'
 *                description: integrationKeyRef
 *              billingAccountId:
 *                type: string
 *                example: '104531853205'
 *                description: billingAccountId
 *              maxRows:
 *                type: integer
 *                example: 999
 *                description: maxRows
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/crm-query-all-invoice-ps', async (req, res) => {
  try {
    const payload = req.body;

    const result = await crmExternal.crmQueryAllInvoicePS(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});
export default router;
