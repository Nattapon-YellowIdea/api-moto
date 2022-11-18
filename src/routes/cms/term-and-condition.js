import express from 'express';
import termAndConditionController from '../../controllers/term-and-condition.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/cms/term-and-condition:
 *  post:
 *    tags: ["CMS Term And Condition"]
 *    description: Create term-and-condition
 *    requestBody:
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail:
 *                 type: string
 *                 example: 'เงือนไขและข้อตกลง'
 *                 description: ระบุเงือนไขและข้อตกลง
 *               updated_by:
 *                 type: string
 *                 example: 'admin'
 *                 description: admin update term and condition
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', termAndConditionController.CMSTOUCreate);

/**
 * @swagger
 * /api/cms/term-and-condition:
 *  get:
 *    tags: ["CMS Term And Condition"]
 *    description: CMS Term And Conditio Show.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', termAndConditionController.CMSTOUShow);

export default router;
