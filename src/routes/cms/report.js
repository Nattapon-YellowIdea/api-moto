import express from 'express';
import reportController from '../../controllers/report.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/cms/report/master-register:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Master Register Data.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/master-register', reportController.ReportMasterRegister);

/**
 * @swagger
 * /api/cms/report/transaction-log-consents:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Transaction Log Consents Data.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/transaction-log-consents', reportController.ReportTransactionLogConsents);

/**
 * @swagger
 * /api/cms/report/transaction-register-service:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Transaction Register Service Data.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/transaction-register-service', reportController.ReportTransactionRegisterService);

/**
 * @swagger
 * /api/cms/report/report-problem:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Report Problem Data.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/report-problem', reportController.ReportReportProblem);

/**
 * @swagger
 * /api/cms/report/transaction-ba:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Transaction ass/remove BA, Service Number Data.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/transaction-ba', reportController.ReportTransactionBA);

/**
 * @swagger
 * /api/cms/report/transaction-topup:
 *  post:
 *    tags: ["CMS Report"]
 *    description: Get all Transaction of Topup.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           properties:
 *             sort:
 *               type: string
 *               example: 'created_at'
 *               description: sort field
 *             order:
 *               type: string
 *               example: 'desc'
 *               description: sort field
 *             limit:
 *               type: number
 *               example: 10
 *               description: limit
 *             offset:
 *               type: number
 *               example: 0
 *               description: skip
 *             filter:
 *               type: object
 *               properties:
 *                  label:
 *                    type: string
 *                    example: ''
 *                    description: filter
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/transaction-topup', reportController.ReportTransactionTopup);

export default router;
