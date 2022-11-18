import express from 'express';
import workingTimeController from '../../controllers/working-time.controller.js';

const router = express.Router();
/**
 * @swagger
 * /api/cms/working-time/update:
 *  post:
 *    tags: ["CMS Working Time Update"]
 *    description: CMS Register Service Update.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - days
 *            properties:
 *              days:
 *                type: object
 *                example: {}
 *                description: days
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update', workingTimeController.CMSWorkingTimeUpdate);

/**
  * @swagger
  * /api/cms/working-time/show:
  *  get:
  *    tags: ["CMS Working Time Show"]
  *    description: CMS Working Time Show.
  *    requestBody:
  *      content:
  *        application/json:
  *          schema:
  *            type: object
  *            properties:
  *    responses:
  *      '200':
  *        description: A successful response
  */
router.get('/show', workingTimeController.CMSWorkingTimeShow);

export default router;
