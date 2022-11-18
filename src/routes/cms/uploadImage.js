import express from 'express';
import uploadController from '../../controllers/upload.controller.js';

const router = express.Router();
/**
 * @swagger
 * /api/cms/upload:
 *  post:
 *    tags: ["CMS Upload"]
 *    description: CMS Upload.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - filename
 *            properties:
 *              filename:
 *                type: string
 *                example: 'test.png'
 *                description: filename
 *              base64:
 *                type: string
 *                example: ''
 *                description: base64
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', uploadController.uploadImage);
export default router;
