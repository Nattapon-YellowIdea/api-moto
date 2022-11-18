import express from 'express';
import trackStatusController from '../../controllers/track-status.controller.js';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  TrackStatus:
 *    type: object
 *    required:
 *      - line_user_id
 *      - tracking_number
 *    properties:
 *      line_user_id:
 *        type: string
 *        example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *        description: userId
 *      tracking_number:
 *        type: string
 *        example: 'SR0000001'
 *        description: Tracking Number
 */

/**
 * @swagger
 * /api/track-status:
 *  post:
 *    tags: ["APP Track Status"]
 *    description: Crack track status.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#definitions/TrackStatus'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', trackStatusController.getTrackStatus);

export default router;
