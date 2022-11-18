import express from 'express';
import registerServiceController from '../../controllers/register-service.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/cms/register-service/update:
 *  post:
 *    tags: ["CMS Register Service Update"]
 *    description: CMS Register Service Update.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - keyword
 *              - datas
 *            properties:
 *              keyword:
 *                type: array
 *                example: ['สมัครบริการ']
 *                description: keyword
 *              datas:
 *                type: array
 *                example: []
 *                description: datas
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update', registerServiceController.CMSRegisterServiceUpdate);

/**
 * @swagger
 * /api/cms/register-service/show:
 *  get:
 *    tags: ["CMS Register Service Show"]
 *    description: CMS Register Service Show.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                example: '6270cc612607dd1b65ce8945'
 *                description: id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/show', registerServiceController.CMSRegisterServiceShow);

export default router;
