import express from 'express';
import topupController from '../../controllers/topup.controller.js';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  Topup:
 *    type: object
 *    required:
 *      - label
 *      - value
 *    properties:
 *      label:
 *        type: string
 *        example: '20 บาท'
 *        description: text show label
 *      value:
 *        type: string
 *        example: 20
 *        description: amount bath
 *      updated_by:
 *        type: string
 *        example: 'admin'
 *        description: create and update by
 */

/**
 * @swagger
 * /api/cms/topup/list:
 *  post:
 *    tags: ["CMS Top up"]
 *    description: Get all users.
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
router.post('/list', topupController.CmsMasterTopupList);

/**
 * @swagger
 * /api/cms/topup:
 *  post:
 *    tags: ["CMS Top up"]
 *    description: Create Top up master
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#definitions/Topup'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', topupController.CmsMasterTopupCreate);

/**
 * @swagger
 * /api/cms/topup/{id}:
 *  get:
 *    tags: ["CMS Top up"]
 *    description: The CMS Top up to show.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        example: '62b02fabedfbeb4bd72bf674'
 *        description: The _id of documents to get user
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/:id', topupController.CmsMasterTopupShow);

/**
 * @swagger
 * /api/cms/topup/{id}:
 *  put:
 *    tags: ["CMS Top up"]
 *    description: The CMS Top up to show.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        example: '62b02fabedfbeb4bd72bf674'
 *        description: The _id of documents to get master_topup
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#definitions/Topup'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/:id', topupController.CmsMasterTopupUpdate);

/**
 * @swagger
 * /api/cms/user/{id}:
 *  delete:
 *    tags: ["CMS Top up"]
 *    description: The CMS Top up to show.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        example: '62b02fabedfbeb4bd72bf674'
 *        description: The _id of documents to get user
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.delete('/:id', topupController.CmsMasterTopupDelete);

export default router;
