import express from 'express';
import termAndConditionController from '../../controllers/term-and-condition.controller.js';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  MasterRegister:
 *    type: object
 *    required:
 *      - line_user_id
 *      - is_consent
 *      - consent_version
 *    properties:
 *        line_user_id:
 *          type: string
 *          example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *          description: userId
 *        consent_version:
 *          type: number
 *          example: 1
 *          description: Version Term and Condition
 */

/**
 * @swagger
 * /api/term-and-condition:
 *  get:
 *    tags: ["App Term And Condition"]
 *    description: App Term And Conditio Show.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', termAndConditionController.termAndConditionShow);

/**
 * @swagger
 * /api/term-and-condition/update:
 *  post:
 *    tags: ["App Term And Condition"]
 *    description: App Term And Conditio Update.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *             $ref: '#definitions/MasterRegister'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update', termAndConditionController.termAndConditionUpdate);

export default router;
