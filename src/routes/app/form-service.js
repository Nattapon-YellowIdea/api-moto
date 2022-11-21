import express from 'express';
import formServiceController from '../../controllers/form.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/form-service/form-3:
 *  post:
 *    tags: ["APP Form "]
 *    description: Form 3.
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
 *              sex:
 *                type: string
 *                example: 'ชาย'
 *                description: Customer's sex type.
 *              age:
 *                type: string
 *                example: '36 - 45 ปี'
 *                description: Customer's age range.
 *              status:
 *                type: string
 *                example: 'โสด'
 *                description: Customer's status.
 *              child_amt:
 *                type: string
 *                example: '1'
 *                description: Customer's child amount.
 *              family_member_amt:
 *                type: string
 *                example: '1'
 *                description: Customer's family member amount.
 *              educate:
 *                type: string
 *                example: 'ปริญญาตรีหรือเทียบเท่า'
 *                description: Customer's email.
 *              career:
 *                type: string
 *                example: 'บริษัทเอกชน'
 *                description: Customer's career.
 *              career_optional:
 *                type: string
 *                example: ''
 *                description: Customer's career optional.
 *              monthly_income:
 *                type: string
 *                example: 'น้อยกว่า 20,000 บาท'
 *                description: Customer's monthly income.
 *              buying_purpose:
 *                type: string
 *                example: 'ต้องการซื้อเพิ่มเติม'
 *                description: Customer's buying purpose.
 *              satisfaction_rate_1:
 *                type: string
 *                example: '3 = พึงพอใจปานกลาง'
 *                description: Customer's satisfaction rate.
 *              satisfaction_rate_2:
 *                type: string
 *                example: '3 = พึงพอใจปานกลาง'
 *                description: Customer's satisfaction rate.
 *              satisfaction_rate_3:
 *                type: string
 *                example: '3 = พึงพอใจปานกลาง'
 *                description: Customer's satisfaction rate.
 *              after_drive_test:
 *                type: string
 *                example: 'ไม่ได้ทำอะไรต่อ / ไม่ได้จองรถ'
 *                description: Customer's after test drive.
 *              after_drive_test_reason:
 *                type: string
 *                example: 'ฟังก์ชั่นและสมรรถนะ'
 *                description: Customer's after test drive if case 'ไม่ได้ทำอะไรต่อ / ไม่ได้จองรถ'.
 *              offer:
 *                type: string
 *                example: 'อัตราดอกเบี้ยพิเศษ'
 *                description: Offer that customer want.
 *              other_offer:
 *                type: string
 *                example: 'ของแถม (ชุดแต่ง,ออฟชั่นเสริม)'
 *                description: Other offer that customer want.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/form-3', formServiceController.submitForm3);

export default router;
