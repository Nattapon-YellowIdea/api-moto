import express from 'express';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    required:
 *      - first_name
 *      - last_name
 *    properties:
 *      first_name:
 *        type: string
 *        example: 'John'
 *        description: First name of user
 *      last_name:
 *        type: string
 *        example: 'Wick'
 *        description: Last name of user
 */

/**
 * @swagger
 * /api/cms/user/list:
 *  post:
 *    tags: ["APP User"]
 *    description: Get all users.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/list', (req, res) => {
  res.json({
    message: 'SUCCESS',
    status: 200,
    rows: [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Wick',
      },
    ],
    total: 1,
  });
});

/**
 * @swagger
 * /api/cms/user:
 *  post:
 *    tags: ["APP User"]
 *    description: Create user
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#definitions/User'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', (req, res) => {
  res.json({
    message: 'CREATE_SUCCESS',
    status: 200,
    data: JSON.stringify(req.body),
  });
});

/**
 * @swagger
 * /api/cms/user/{id}:
 *  get:
 *    tags: ["APP User"]
 *    description: The user to show.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        example: '6220495a09d1b75c47133c21'
 *        description: The _id of documents to get user
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/:id', (req, res) => {
  res.json({
    message: 'SHOW_SUCCESS',
    status: 200,
    data: {
      id: '1',
      first_name: 'John',
      last_name: 'Wick',
    },
  });
});

export default router;
