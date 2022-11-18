import express from 'express';
import reportProblemServiceController from '../../controllers/report-problem.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/report-problem/tier-form:
 *  post:
 *    tags: ["APP Report Problem"]
 *    description: tier-form
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: userId
 *              service_type:
 *                type: string
 *                example: '006'
 *                description: service_type
 *              reason:
 *                type: string
 *                example: '1'
 *                description: reason
 *              service_type_name:
 *                type: string
 *                example: '006'
 *                description: service_type_name
 *              reason_name:
 *                type: string
 *                example: '1'
 *                description: reason_name
 *              customer_title:
 *                type: string
 *                example: 'อื่นๆ (โปรดระบุ)'
 *                description: customer_title
 *              customer_title_optional:
 *                type: string
 *                example: 'รศ ดร'
 *                description: customer_title_optional
 *              customer_first_name:
 *                type: string
 *                example: 'สุพรรณี'
 *                description: customer_first_name
 *              customer_last_name:
 *                type: string
 *                example: 'ประจงใจ'
 *                description: customer_last_name
 *              customer_mobile:
 *                type: string
 *                example: '0987654321'
 *                description: customer_mobile
 *              customer_email:
 *                type: string
 *                example: 'suphunnee.por@gmail.com'
 *                description: customer_email
 *              service_number:
 *                type: string
 *                example: '02-990-9000'
 *                description: service number
 *              detail:
 *                type: string
 *                example: ''
 *                description: detail
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/tier-form', reportProblemServiceController.tierForm);

/**
 * @swagger
 * /api/report-problem/get-status-by-ticket:
 *  post:
 *    tags: ["APP Report Problem"]
 *    description: get-status-by-ticket.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ticket:
 *                type: string
 *                example: '28928080'
 *                description: ticket
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-status-by-ticket', reportProblemServiceController.getStatusByTicket);

/**
 * @swagger
 * /api/report-problem/get-feedback-list:
 *  post:
 *    tags: ["APP Report Problem"]
 *    description: get-feedback-list.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-feedback-list', reportProblemServiceController.getFeedbackList);

export default router;
