import express from 'express';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import scomExternal from '../../../external/scom.js';

const router = express.Router();

/**
 * @swagger
 * /api/scom-external/get-cominfo-all-office:
 *  post:
 *    tags: ["External SCOM"]
 *    description: External SCOM Service getCominfoAllOffice.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-cominfo-all-office', async (req, res) => {
  try {
    const payload = req.body;

    const result = await scomExternal.getCominfoAllOffice(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/scom-external/get-cominfo-near-office-by-lat-lon:
 *  post:
 *    tags: ["External SCOM"]
 *    description: External SCOM Service getCominfoNearOfficeByLatLon.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              lat:
 *                type: string
 *                example: '13.8874875'
 *                description: Latitude
 *              lon:
 *                type: string
 *                example: '100.5767497'
 *                description: Longitude
 *              distance:
 *                type: integer
 *                example: 1000
 *                description: Distance
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-cominfo-near-office-by-lat-lon', async (req, res) => {
  try {
    const payload = req.body;

    const result = await scomExternal.getCominfoNearOfficeByLatLon(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

/**
 * @swagger
 * /api/scom-external/get-cominfo-office-by-location:
 *  post:
 *    tags: ["External SCOM"]
 *    description: External SCOM Service getCominfoOfficeByLocation.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              location:
 *                type: string
 *                example: '8604'
 *                description: Location code
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-cominfo-office-by-location', async (req, res) => {
  try {
    const payload = req.body;

    const result = await scomExternal.getCominfoOfficeByLocation(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err.message });
  }
});

export default router;
