import express from 'express';
import registerServiceController from '../../controllers/register-service.controller.js';
import { getIP, serviceAccessVerify } from '../../middleware/middleware.js';

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
 *              form_id:
 *                type: string
 *                example: '6267948e895c7ecd568b3424'
 *                description: ID of transaction register service
 *              customer_sex:
 *                type: integer
 *                example: 2
 *                description: customer_sex
 *              customer_title:
 *                type: string
 *                example: 'อื่นๆ (โปรดระบุ)'
 *                description: customer_title
 *              customer_title_optional:
 *                type: string
 *                example: 'รศ ดร'
 *                description: customer_title_optional
 *              customer_first_name:
 *                type: string
 *                example: 'สุพรรณี'
 *                description: customer_first_name
 *              customer_last_name:
 *                type: string
 *                example: 'ประจงใจ'
 *                description: customer_last_name
 *              personal_id:
 *                type: string
 *                example: '1109700461509'
 *                description: personal_id
 *              customer_mobile:
 *                type: string
 *                example: '0987654321'
 *                description: customer_mobile
 *              customer_email:
 *                type: string
 *                example: 'suphunnee.por@gmail.com'
 *                description: customer_email
 *              customer_no:
 *                type: string
 *                example: '214/14'
 *                description: customer_no
 *              customer_building:
 *                type: string
 *                example: '-'
 *                description: customer_building
 *              customer_road:
 *                type: string
 *                example: 'สุขุมวิท 109'
 *                description: customer_road
 *              customer_subdistrict:
 *                type: string
 *                example: 'พลูตาหลวง'
 *                description: customer_subdistrict
 *              customer_district_id:
 *                type: integer
 *                example: '4567'
 *                description: customer_district_id
 *              customer_province_id:
 *                type: integer
 *                example: '98'
 *                description: customer_province_id
 *              customer_zip:
 *                type: string
 *                example: '20180'
 *                description: customer_zip
 *              province:
 *                type: string
 *                example: 'ชลบุรี'
 *                description: province
 *              district:
 *                type: string
 *                example: 'เมือง'
 *                description: district
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', registerServiceController.registerForm);

/**
 * @swagger
 * /api/register-service/pay-for-installation:
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
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/pay-for-installation', registerServiceController.payForInstallation);

/**
 * @swagger
 * /api/register-service/get-schedule-available:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: get-schedule-available.
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
 *              office_id:
 *                type: string
 *                example: '65'
 *                description: office_id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-schedule-available', registerServiceController.getScheduleAvailable);

/**
 * @swagger
 * /api/register-service/date-install-estimate:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: dateInstallEstimate.
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
 *              order_id:
 *                type: string
 *                example: '15668593'
 *                description: order_id
 *              date_time:
 *                type: string
 *                example: '2022-07-01 10:00:00'
 *                description: date_time
 *              order_code:
 *                type: string
 *                example: 'SR15668593'
 *                description: order_code
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/date-install-estimate', registerServiceController.dateInstallEstimate);

/**
 * @swagger
 * /api/register-service/schedule-installation-date:
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
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/schedule-installation-date', registerServiceController.scheduleInstallationDate);

/**
 * @swagger
 * /api/register-service/lead-from:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: lead form.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *              - first_name
 *              - last_name
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: user's line mid
 *              first_name:
 *                type: string
 *                example: 'suphunnee'
 *                description: first_name
 *              last_name:
 *                type: string
 *                example: 'projongjai'
 *                description: last_name
 *              mobile:
 *                type: string
 *                example: '0987654321'
 *                description: mobile
 *              date_install:
 *                type: string
 *                example: '2022-07-21 10:00:00'
 *                description: date_install
 *              latitude:
 *                type: string
 *                example: '12.682868'
 *                description: latitude
 *              longitude:
 *                type: string
 *                example: '100.939973'
 *                description: longitude
 *              address:
 *                type: string
 *                example: '214/14 หมู่ 7 หมู่บ้านเข้าหมอนโกลเด้นฮิลล์'
 *                description: address
 *              no:
 *                type: integer
 *                example: '214/14'
 *                description: string
 *              village:
 *                type: string
 *                example: 'เขาหมอนโกลเด้นฮิลล์'
 *                description: village
 *              building:
 *                type: string
 *                example: '-'
 *                description: building
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
 *              district:
 *                type: string
 *                example: 'สัตหีบ'
 *                description: district
 *              subdistrict:
 *                type: string
 *                example: 'พลูตาหลวง'
 *                description: subdistrict
 *              zip_code:
 *                type: string
 *                example: '20180'
 *                description: zip_code
 *              promotion_id:
 *                type: string
 *                example: ''
 *                description: promotion_id
 *              speed_id:
 *                type: string
 *                example: ''
 *                description: speed_id
 *              note:
 *                type: string
 *                example: ''
 *                description: note
 *              device_id:
 *                type: string
 *                example: ''
 *                description: device_id
 *              exchange_id:
 *                type: string
 *                example: ''
 *                description: exchange_id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/lead-from', registerServiceController.leadFrom);

/**
 * @swagger
 * /api/register-service/check-blacklist:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: check register.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - personal_id
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: user's line mid
 *              cid:
 *                type: string
 *                example: '3580300151853'
 *                description: cid
 *              type:
 *                type: string
 *                example: 'passport'
 *                description: type
 *              passport:
 *                type: string
 *                example: 'A1234567'
 *                description: passport
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-blacklist', registerServiceController.checkBlacklist);

/**
 * @swagger
 * /api/register-service/get-detail-register-service:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Post user detail.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: string
 *                example: '62b00cf3bd34738e83997c88'
 *                description: form's id
 *              userId:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: userId
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-detail-register-service', registerServiceController.getDetailRegisterService);

/**
 * @swagger
 * /api/register-service/get-detail-master-register-service:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Post detail fof master register service.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: string
 *                example: 'id'
 *                description: form's id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/get-detail-master-register-service', registerServiceController.getDetailMasterRegisterService);

/**
 * @swagger
 * /api/register-service/payments-otc:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Post payments-otc.
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
 *                example: 'U8eea0419dbb6d88775d9f875f405bf5b'
 *                description: user's line mid
 *              order_code:
 *                type: string
 *                required: true
 *                example: 'SR2203651'
 *                description: order code
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/payments-otc', getIP, serviceAccessVerify, registerServiceController.paymentsOtc);

/**
 * @swagger
 * /api/register-service/check-order-status:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Post check-order-status.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: userId
 *              order_code:
 *                type: string
 *                example: 'SR2203651'
 *                description: order_code
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-order-status', registerServiceController.checkOrderStatus);

/**
 * @swagger
 * /api/register-service/get-list-sr:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Get list of SR Code by line_user_id.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              line_user_id:
 *                type: string
 *                example: 'Ub0af3eff76a6166733ee8073d2d943d9'
 *                description: line_user_id
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-list-sr', registerServiceController.getSRList);

/**
 * @swagger
 * /api/register-service/update-order-status:
 *  post:
 *    tags: ["APP Register Service"]
 *    description: Update order status.
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
 *              id:
 *                type: string
 *                example: '62d6735474e17813bc21248e'
 *                description: id's form
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/update-order-status', registerServiceController.updateOrderStatus);

export default router;
