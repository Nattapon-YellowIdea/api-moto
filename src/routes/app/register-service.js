import express from 'express';
import registerServiceController from '../../controllers/register-service.controller.js';
// import { getIP, serviceAccessVerify } from '../../middleware/middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/register-service/register:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Register service form.
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
 *              first_name:
 *                type: string
 *                example: 'Firstname'
 *                description: Firstname
 *              last_name:
 *                type: string
 *                example: 'Lastname'
 *                description: Lastname
 *              mobile:
 *                type: string
 *                example: '0950000000'
 *                description: Customer's mobile.
 *              email:
 *                type: string
 *                example: 'test@test.com'
 *                description: Customer's email.
 *              nissan_customer:
 *                type: string
 *                example: Y
 *                description: Y/N
 *              current_car_brand:
 *                type: string
 *                example: 'TOYOTA'
 *                description: Customer current car brand.
 *              interested_car:
 *                type: string
 *                example: 'TOYOTA'
 *                description: ''
 *              buying_plan:
 *                type: string
 *                example: 'จองรถแล้ว'
 *                description: ''
 *              buying_factor:
 *                type: string
 *                example: 'เทคโนโลยีระบบความปลอดภัย,ดีไซน์ภายนอก,ดีไซน์ภายใน,บริการหลังการขาย,สมรรถนะของเครื่องยนต์,ประหยัดน้ำมัน / ไฟฟ้า'
 *                description: ''
 *              consent_1:
 *                type: string
 *                example: Y
 *                description: Y/N
 *              consent_2:
 *                type: string
 *                example: Y
 *                description: Y/N
 *              consent_3:
 *                type: string
 *                example: Y
 *                description: Y/N
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', registerServiceController.registerForm);

/**
 * @swagger
 * /api/register-service/check-register:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: check register.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mid:
 *                type: string
 *                example: 'mid'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-register', registerServiceController.checkRegister);

export default router;
