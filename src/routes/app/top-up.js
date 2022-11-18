import express from 'express';
import topupController from '../../controllers/topup.controller.js';
import { getIP } from '../../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/top-up/verify:
 *  post:
 *    tags: ["APP Top up"]
 *    description: Post verify.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - amount
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: userId
 *              amount:
 *                type: string
 *                example: '100'
 *                description: amount
 *              mobile:
 *                type: string
 *                example: '0975753740'
 *                description: mobile
 *              master_topup_id:
 *                type: string
 *                example: '6267948e895c7ecd568b3424'
 *                description: ID of master top up
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/verify', topupController.TopupVerify);

/**
 * @swagger
 * /api/top-up/get-address:
 *  post:
 *    tags: ["APP Top up"]
 *    description: Post get address.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - amount
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: userId
 *              transaction_id:
 *                type: string
 *                example: '6267948e895c7ecd568b3424'
 *                description: ID of transaction top up
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-address', topupController.TopupGetAddress);

/**
 * @swagger
 * /api/top-up/topup-price-list:
 *  post:
 *    tags: ["APP Top up"]
 *    description: Get Top up price list.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/topup-price-list', topupController.TopupGetPriceList);

/**
 * @swagger
 * /api/top-up/topup-pay:
 *  post:
 *    tags: ["APP Top up"]
 *    description: Post get address.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - mobile
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: userId
 *              transaction_id:
 *                type: string
 *                example: '6267948e895c7ecd568b3424'
 *                description: ID of transaction top up
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/topup-pay', getIP, topupController.TopupPay);

/**
 * @swagger
 * /api/top-up/get-detail:
 *  post:
 *    tags: ["APP Top up"]
 *    description: Post get detail.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - mobile
 *            properties:
 *              transaction_id:
 *                type: string
 *                example: '6267948e895c7ecd568b3424'
 *                description: ID of transaction top up
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-detail', topupController.TopupGetDetail);
export default router;
