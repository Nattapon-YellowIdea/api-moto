import express from 'express';
import eServiceController from '../../controllers/e-service.controller.js';
import { getIP, serviceAccessVerify } from '../../middleware/middleware.js';

const router = express.Router();
/**
 * @swagger
 * /api/e-service/register:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service register.
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
 *              socialid:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: userId
 *              displayname:
 *                type: string
 *                example: 'Name'
 *                description: social displayname แสดงชื่อ Display name ผู้ใช้
 *              email:
 *                type: string
 *                example: 'email@gmail.com'
 *                description: email
 *              password:
 *                type: string
 *                example: '123456'
 *                description: your password
 *              mobile:
 *                type: string
 *                example: '0985641236'
 *                description: your mobile
 *              idnumbertype:
 *                type: integer
 *                example: 1
 *                description: 1 = CitizenID, 2 = Passport
 *              idnumber:
 *                type: string
 *                example: '3400800068671'
 *                description: หมายเลขบัตรประชาชน , Passport
 *              is_consent:
 *                type: boolean
 *                example: true
 *                description: is consent Term and Condition
 *              consent_version:
 *                type: number
 *                example: 1
 *                description: Version Term and Condition
 *              x-clientip:
 *                type: string
 *                example: '0.0.0.0'
 *                description: clientip
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', eServiceController.registerForm);

/**
 * @swagger
 * /api/e-service/payment:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service payment.
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
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post('/payment', eServiceController.payment);

/**
 * @swagger
 * /api/e-service/login-with-social:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service login with social.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              loginpage:
 *                type: integer
 *                example: 1
 *                description: 1 only
 *              type:
 *                type: integer
 *                example: 3
 *                description: 3 only
 *              socialtype:
 *                type: string
 *                example: '2'
 *                description: 2 only
 *              socialid:
 *                type: string
 *                example: 'social_id'
 *                description: Social ID value
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/login-with-social', eServiceController.loginWithSocial);

/**
 * @swagger
 * /api/e-service/login-with-email:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service login with email.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: 'test@test.com'
 *                description: Email
 *              password:
 *                type: string
 *                example: '123456'
 *                description: password
 *              line_user_id:
 *                type: string
 *                example: 'xxxxxx'
 *                description: User's line mid.
 *              is_consent:
 *                type: Boolean
 *                example: true
 *                description: boolean of term and condition.
 *              consent_verion:
 *                type: integer
 *                example: 1
 *                description: Version of term and condition
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/login-with-email', eServiceController.loginWithEmail);

/**
 * @swagger
 * /api/e-service/login-with-phone:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service login with phone number.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'xxxxxx'
 *                description: User's line mid.
 *              mobile:
 *                type: string
 *                example: '0956412539'
 *                description: Phone number
 *              is_consent:
 *                type: Boolean
 *                example: true
 *                description: boolean of term and condition.
 *              consent_verion:
 *                type: integer
 *                example: 1
 *                description: Version of term and condition
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/login-with-phone', eServiceController.loginWithPhone);

/**
 * @swagger
 * /api/e-service/activate-user:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service activate user.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/activate-user', eServiceController.activateUser);

/**
 * @swagger
 * /api/e-service/request-otp:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service request otp.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *    responses:
 *      '200':
 *        description: A successful response and 6dit otp
 */
router.post('/request-otp', eServiceController.requestOtp);

/**
 * @swagger
 * /api/e-service/confirm-otp:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service confirm otp 6dit.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              otp_number:
 *                type: string
 *                example: '0123456'
 *                description: OTP number
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/confirm-otp', eServiceController.confirmOtp);

/**
 * @swagger
 * /api/e-service/confirm-otp-login:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service confirm otp 6dit.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              otp_number:
 *                type: string
 *                example: '0123456'
 *                description: OTP number
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/confirm-otp-login', eServiceController.confirmOtpLogin);

/**
 * @swagger
 * /api/e-service/forgot-password:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service forgot password request
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              email:
 *                type: string
 *                example: '1234567890'
 *                description: Email's of user.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/forgot-password', getIP, eServiceController.forgotPassword);

/**
 * @swagger
 * /api/e-service/change-password:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service reset password
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              current_password:
 *                type: string
 *                example: 'Y0VCemMxZHZja1E9'
 *                description: double encrypt is required!
 *              new_password:
 *                type: string
 *                example: 'Y0VCemMxZHZja1E9'
 *                description: double encrypt is required!
 *              confirm_password:
 *                type: string
 *                example: 'Y0VCemMxZHZja1E9'
 *                description: double encrypt is required!
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/change-password', serviceAccessVerify, getIP, eServiceController.changePassword);

/**
 * @swagger
 * /api/e-service/get-member-profile:
 *  get:
 *    tags: ["APP e-Service"]
 *    description: e-service get merber profile
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/get-member-profile', serviceAccessVerify, getIP, eServiceController.getMemberProfile);

/**
 * @swagger
 * /api/e-service/update-member-profile:
 *  put:
 *    tags: ["APP e-Service"]
 *    description: e-service update merber profile
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              titlename:
 *                type: string
 *                example: 'นาย'
 *                description: xxxx
 *              firstname:
 *                type: string
 *                example: 'xxxxx'
 *                description: xxxx
 *              lastname:
 *                type: string
 *                example: 'xxxxx'
 *                description: xxx
 *              email:
 *                type: string
 *                example: 'email@gmail.com'
 *                description: email
 *              password:
 *                type: string
 *                example: '123456'
 *                description: your password double encrypt already
 *              mobile:
 *                type: string
 *                example: '0985641236'
 *                description: your mobile
 *              idnumbertype:
 *                type: integer
 *                example: 1
 *                description: 1 = CitizenID, 2 = Passport
 *              idnumber:
 *                type: string
 *                example: '3400800068671'
 *                description: หมายเลขบัตรประชาชน , Passport
 *              is_consent:
 *                type: boolean
 *                example: true
 *                description: 1 = Accept, 2 = No Accept
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/update-member-profile', serviceAccessVerify, getIP, eServiceController.updateMemberProfile);

/**
 * @swagger
 * /api/e-service/add-ba:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service create merber service number
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/add-ba', serviceAccessVerify, getIP, eServiceController.addBa);

/**
 * @swagger
 * /api/e-service/remove-ba:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service remove merber service number
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              servicetype:
 *                type: string
 *                example: '2'
 *                description: ประเภทหมายเลขบริการ
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/remove-ba', serviceAccessVerify, getIP, eServiceController.removeBa);

/**
 * @swagger
 * /api/e-service/ba-list:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service BA list.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/ba-list', serviceAccessVerify, getIP, eServiceController.getBaLists);

/**
 * @swagger
 * /api/e-service/bill-list:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service bill list
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U663bafb6731ac47584df8105fbd2f33d'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/bill-list', serviceAccessVerify, getIP, eServiceController.billList);

/**
 * @swagger
 * /api/e-service/check-register:
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
router.post('/check-register', eServiceController.checkRegister);

/**
 * @swagger
 * /api/e-service/check-follow:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: check follow.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'mid'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-follow', eServiceController.checkFollow);

/**
 * @swagger
 * /api/e-service/request-member-token:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Request new token.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U663bafb6731ac47584df8105fbd2f33d'
 *                description: user's line mid
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/request-member-token', getIP, eServiceController.requestMemberToken);

/**
 * @swagger
 * /api/e-service/pay-bill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Post pay bill.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - order_code
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              balists:
 *                type: array
 *                example:
 *                - ba: '000116538185'
 *                - ba: '000116540162'
 *                - ba: '000116558471'
 *                description: balists
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/pay-bill', serviceAccessVerify, getIP, eServiceController.payBill);

/**
 * @swagger
 * /api/e-service/get-otp-ref:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Get OTP Ref code..
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-otp-ref', eServiceController.getOtpRefCode);

/**
 * @swagger
 * /api/e-service/payment-billing-detail:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Get bill detail for slip.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - transactionRef
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              transactionRef:
 *                type: string
 *                example: 'TmpVNE1EQXdNREV5TXc9PQ=='
 *                description: transactionRef if from url double decode base64
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/payment-billing-detail', serviceAccessVerify, getIP, eServiceController.getBillingDetail);

/**
 * @swagger
 * /api/e-service/update/transaction/paybill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Update transaction paybill by orderRefId.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - orderRefId
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              orderRefId:
 *                type: string
 *                example: '62fb5c4a551542d9ad9dd677'
 *                description: orderRefId
 *              transactionRef:
 *                type: string
 *                example: 'TmpVNE1EQXdNREV5TXc9PQ=='
 *                description: transactionRef if from url.
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update/transaction/paybill', serviceAccessVerify, getIP, eServiceController.updateTransactionPayBill);

/**
 * @swagger
 * /api/e-service/get-transaction-paybill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Get transaction of pay bill data by orderRefId.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - orderRefId
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              orderRefId:
 *                type: string
 *                example: '62fb5c4a551542d9ad9dd677'
 *                description: 'TmpNeU1qbGpNelZoTXpBNFpEa3lZMk0zWldKaU0yVXg='
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-transaction-paybill', eServiceController.getTransactionPayBill);

/**
 * @swagger
 * /api/e-service/update-bill-alert:
 *  put:
 *    tags: ["APP e-Service"]
 *    description: update user's bill alert.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              before_due:
 *                type: Number
 *                example: 1
 *                description: 1 = true, 0 = false
 *              after_due:
 *                type: Number
 *                example: 0
 *                description: 1 = true, 0 = false
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/update-bill-alert', serviceAccessVerify, getIP, eServiceController.updateBillAlert);

/**
 * @swagger
 * /api/e-service/register-eBill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Register E-Bill.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              servicetype:
 *                type: string
 *                example: '2'
 *                description: ประเภทหมายเลขบริการ fixedlind,mobile
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *              ebill_email:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register-eBill', serviceAccessVerify, getIP, eServiceController.regsiterEBill);

/**
 * @swagger
 * /api/e-service/update-eBill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: Update E-Bill email.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              servicetype:
 *                type: string
 *                example: '2'
 *                description: ประเภทหมายเลขบริการ fixedlind,mobile
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *              ebill_email:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update-eBill', serviceAccessVerify, getIP, eServiceController.updateEBill);

/**
 * @swagger
 * /api/e-service/request-otp-bill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service request otp of bill.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              phone_number:
 *                type: string
 *                example: '0000000000'
 *                description: phone number
 *              service:
 *                type: string
 *                example: 'e-bill'
 *                description: name of service request
 *    responses:
 *      '200':
 *        description: A successful response and 6dit otp
 */
router.post('/request-otp-bill', eServiceController.requestOtpBill);

/**
 * @swagger
 * /api/e-service/get-otp-bill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service get otp of bill service.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *    responses:
 *      '200':
 *        description: A successful response and 6dit otp
 */
router.post('/get-otp-bill', eServiceController.getOtpBill);

/**
 * @swagger
 * /api/e-service/confirm-otp-bill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service confirm otp 6dit.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              otp_number:
 *                type: string
 *                example: '0123456'
 *                description: OTP number
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/confirm-otp-bill', eServiceController.confirmOtpBill);

/**
 * @swagger
 * /api/e-service/update-member-tier:
 *  put:
 *    tags: ["APP e-Service"]
 *    description: e-service udpate member Tier 2 => 3.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
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
 *              idnumbertype:
 *                type: integer
 *                example: 1
 *                description: 1 = CitizenID, 2 = Passport
 *              idnumber:
 *                type: string
 *                example: 'TXpRd01EZ3dNREEyT0RZM01RPT0='
 *                description: หมายเลขบัตรประชาชน , Passport. Double base64 encrypt is required!
 *              email:
 *                type: string
 *                example: 'VFhwUmQwMUVaM2ROUkVFeVQwUlpNMDFSUFQwPQ=='
 *                description: email. Double base64 encrypt is required!
 *              password:
 *                type: string
 *                example: 'TVRJek5EVTI='
 *                description: your password. Double base64 encrypt is required!
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/update-member-tier', serviceAccessVerify, getIP, eServiceController.updateMemberTier);

/**
 * @swagger
 * /api/e-service/check-e-bill:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service check user's e-Bill status.
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
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-e-bill', serviceAccessVerify, getIP, eServiceController.checkEbill);

/**
 * @swagger
 * /api/e-service/get-bill-address:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: e-service get user's e-Bill address data.
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
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-bill-address', eServiceController.getBillAddress);

/**
 * @swagger
 * /api/e-service/update-bill-address:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: update bill address.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              servicetype:
 *                type: string
 *                example: '2'
 *                description: ประเภทหมายเลขบริการ fixedlind,mobile
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *              homeno:
 *                type: integer
 *                example: '214/14'
 *                description: string
 *              village:
 *                type: string
 *                example: 'เขาหมอนโกลเด้นฮิลล์'
 *                description: village
 *              moo:
 *                type: string
 *                example: ''
 *                description: moo
 *              soi:
 *                type: string
 *                example: 'มิตรอารีย์'
 *                description: soi
 *              road:
 *                type: string
 *                example: 'สุขุมวิท 109'
 *                description: road
 *              province:
 *                type: string
 *                example: 'ชลบุรี'
 *                description: province
 *              amphur:
 *                type: string
 *                example: 'สัตหีบ'
 *                description: district
 *              tambol:
 *                type: string
 *                example: 'พลูตาหลวง'
 *                description: subdistrict
 *              zipcode:
 *                type: string
 *                example: '20180'
 *                description: zip_code
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update-bill-address', serviceAccessVerify, getIP, eServiceController.updateBillAddress);

/**
 * @swagger
 * /api/e-service/update-bill-email:
 *  post:
 *    tags: ["APP e-Service"]
 *    description: update bill email.
 *    parameters:
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *              servicetype:
 *                type: string
 *                example: '2'
 *                description: ประเภทหมายเลขบริการ fixedlind,mobile
 *              ba:
 *                type: string
 *                example: '0123456789012'
 *                description: รหัสลูกค้า
 *              serviceno:
 *                type: string
 *                example: 'F123456789'
 *                description: หมายเลขบริการ
 *              contact_email:
 *                type: string
 *                example: 'test@test.com'
 *                description: อีเมล
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update-bill-email', serviceAccessVerify, getIP, eServiceController.updateBillEmail);

/**
* @swagger
* /api/e-service/update-bill-address:
*  post:
*    tags: ["APP e-Service"]
*    description: update bill phone number.
*    parameters:
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              line_user_id:
*                type: string
*                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
*                description: line_user_id
*              servicetype:
*                type: string
*                example: '2'
*                description: ประเภทหมายเลขบริการ fixedlind,mobile
*              ba:
*                type: string
*                example: '0123456789012'
*                description: รหัสลูกค้า
*              serviceno:
*                type: string
*                example: 'F123456789'
*                description: หมายเลขบริการ
*              contact_molbile:
*                type: string
*                example: '0000000000'
*                description: หมายเลขโทรศัพท์
*    responses:
*      '200':
*        description: A successful response
*/
router.post('/update-bill-phone', serviceAccessVerify, getIP, eServiceController.updateBillPhoneNumber);

/**
* @swagger
* /api/e-service/social-block:
*  put:
*    tags: ["APP e-Service"]
*    description: e-Service สำหรับ block line.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            type: object
*            properties:
*              line_user_id:
*                type: string
*                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
*                description: line_user_id
*    responses:
*      '200':
*        description: A successful response
*/
router.put('/social-block', getIP, eServiceController.socialBlock);

export default router;
