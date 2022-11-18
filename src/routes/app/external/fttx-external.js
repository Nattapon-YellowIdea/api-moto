import express from 'express';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import fttxExternal from '../../../external/fttx.js';

const router = express.Router();

/**
 * @swagger
 * /api/fttx-external/get-search-dp-on-area:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service getSearchDpOnArea.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              lat:
 *                type: string
 *                example: '7.90196068993375'
 *                description: Latitude
 *              lng:
 *                type: string
 *                example: '98.99084655952292'
 *                description: Longitude
 *              dp_test:
 *                type: integer
 *                example: 2
 *                description: DP
 *              village:
 *                type: string
 *                example: ''
 *                description: Village
 *              subdistrict:
 *                type: string
 *                example: ''
 *                description: Subdistrict
 *              district_id:
 *                type: integer
 *                example: 0
 *                description: District ID
 *              province_id:
 *                type: integer
 *                example: 0
 *                description: Province ID
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-search-dp-on-area', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getSearchDpOnArea(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/get-create-orders-new:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service getCreateOrdersNew.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: password
 *              customer_code:
 *                type: string
 *                example: 'C01234567'
 *                description: customer_code
 *              personal_id:
 *                type: string
 *                example: '3994457856904'
 *                description: personal_id
 *              customer_sex:
 *                type: integer
 *                example: 1
 *                description: customer_sex
 *              customer_title:
 *                type: string
 *                example: 'นาย'
 *                description: customer_title
 *              customer_first_name:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_first_name
 *              customer_last_name:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_last_name
 *              customer_address:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_address
 *              customer_no:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_no
 *              customer_village:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_village
 *              customer_building:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_building
 *              customer_moo:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_moo
 *              customer_soi:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_soi
 *              customer_road:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_road
 *              customer_subdistrict:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: customer_subdistrict
 *              customer_district_id:
 *                type: integer
 *                example: 0
 *                description: customer_district_id
 *              customer_province_id:
 *                type: integer
 *                example: 0
 *                description: customer_province_id
 *              customer_zip:
 *                type: string
 *                example: '80110'
 *                description: customer_zip
 *              customer_lat_lon:
 *                type: string
 *                example: '17.90810067048005,101.68975353240967'
 *                description: customer_lat_lon
 *              customer_birthday_2:
 *                type: string
 *                example: '2014-12-03'
 *                description: customer_birthday_2
 *              customer_email:
 *                type: string
 *                example: 'mail@mail.com'
 *                description: customer_email
 *              customer_phoneno:
 *                type: string
 *                example: '076463272'
 *                description: customer_phoneno
 *              customer_mobile:
 *                type: string
 *                example: '0832454837'
 *                description: customer_mobile
 *              customer_customer_type_id:
 *                type: integer
 *                example: 1
 *                description: customer_customer_type_id
 *              order_address:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_address
 *              order_no:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_no
 *              order_village:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_village
 *              order_building:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_building
 *              order_moo:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_moo
 *              order_soi:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_soi
 *              order_road:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_road
 *              order_subdistrict:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: order_subdistrict
 *              order_district_id:
 *                type: string
 *                example: '0'
 *                description: order_district_id
 *              order_province_id:
 *                type: string
 *                example: '0'
 *                description: order_province_id
 *              order_postcode:
 *                type: string
 *                example: '80110'
 *                description: order_postcode
 *              order_lat_lon:
 *                type: string
 *                example: '17.90810067048005,101.68975353240967'
 *                description: order_lat_lon
 *              order_office_id:
 *                type: integer
 *                example: 353
 *                description: order_office_id
 *              order_office_id_device:
 *                type: integer
 *                example: 353
 *                description: order_office_id_device
 *              order_office_id_number:
 *                type: integer
 *                example: 353
 *                description: order_office_id_number
 *              order_office_id_sale:
 *                type: integer
 *                example: 353
 *                description: order_office_id_sale
 *              order_exchange_id:
 *                type: integer
 *                example: 353
 *                description: order_exchange_id
 *              order_device_id:
 *                type: integer
 *                example: 8479647
 *                description: order_device_id
 *              order_position:
 *                type: string
 *                example: 'O0001'
 *                description: order_position
 *              order_distance_estimated:
 *                type: integer
 *                example: 105.6
 *                description: order_distance_estimated
 *              crm_id:
 *                type: integer
 *                example: 1
 *                description: crm_id
 *              order_promotion_id:
 *                type: integer
 *                example: 1
 *                description: order_promotion_id
 *              order_package_id:
 *                type: integer
 *                example: 1
 *                description: order_package_id
 *              order_speed_id:
 *                type: integer
 *                example: 1
 *                description: order_speed_id
 *              order_status_id:
 *                type: integer
 *                example: 1
 *                description: order_status_id
 *              ref_id:
 *                type: string
 *                example: '1'
 *                description: ref_id
 *              cost_maintenance:
 *                type: integer
 *                example: 0
 *                description: cost_maintenance
 *              cost_setup:
 *                type: integer
 *                example: 0
 *                description: cost_setup
 *              cost_fee:
 *                type: integer
 *                example: 0
 *                description: cost_fee
 *              cost_over_cable:
 *                type: integer
 *                example: 0
 *                description: cost_over_cable
 *              cost_ont:
 *                type: integer
 *                example: 0
 *                description: cost_ont
 *              ont_int:
 *                type: integer
 *                example: 0
 *                description: ont_int
 *              ca:
 *                type: string
 *                example: 'A001'
 *                description: ca
 *              permission_place:
 *                type: integer
 *                example: -1
 *                description: permission_place
 *              polyline:
 *                type: string
 *                example: 'mjfo@ude{QjAOXG@T?n@'
 *                description: polyline
 *              speed:
 *                type: string
 *                example: '102400/20480'
 *                description: speed
 *              service_name:
 *                type: string
 *                example: 'fttxhome100m20'
 *                description: service_name
 *              dealer_id:
 *                type: string
 *                example: 'dealer'
 *                description: dealer_id
 *              date_time_eservice:
 *                type: string
 *                example: '2022-07-10 15:22:00'
 *                description: date_time_eservice
 *              referer:
 *                type: string
 *                example: 'refer'
 *                description: referer
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-create-orders-new', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getCreateOrdersNew(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/check-order-status:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service getCheckOrderStatus.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              value:
 *                type: string
 *                example: 'SR2203651'
 *                description: Value
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/check-order-status', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getCheckOrderStatus(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/get-payment:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service getPayments.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              order_id:
 *                type: string
 *                example: '15698928'
 *                description: Order id
 *              order_code:
 *                type: string
 *                example: 'SR15698941'
 *                description: Order code
 *              payment_methods_id:
 *                type: integer
 *                example: 8
 *                description: Payment method ID
 *              receive_no:
 *                type: string
 *                example: '62da60ca91bcddd55d129710'
 *                description: Receive NO
 *              amount:
 *                type: integer
 *                example: 0
 *                description: Amount
 *              comments:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: Comments
 *              amount_device:
 *                type: integer
 *                example: 0
 *                description: Amount device
 *              same_install:
 *                type: integer
 *                example: 1
 *                description: Same install
 *              house_no:
 *                type: string
 *                example: '1045'
 *                description: House NO
 *              moo:
 *                type: string
 *                example: ''
 *                description: Moo
 *              village:
 *                type: string
 *                example: ''
 *                description: Village
 *              soi:
 *                type: string
 *                example: ''
 *                description: Soi
 *              road:
 *                type: string
 *                example: 'กรุงธนบุรี บางลำภูล่าง คลองสาน'
 *                description: Road
 *              sub_district:
 *                type: string
 *                example: 'คลองสาน'
 *                description: Sub district
 *              district_id:
 *                type: integer
 *                example: 18
 *                description: District ID
 *              province_id:
 *                type: integer
 *                example: 10
 *                description: Province ID
 *              zip:
 *                type: integer
 *                example: 10600
 *                description: Zip
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-payment', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getPayments(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/get-schedule-available:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service getScheduleAvailable.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              office_id:
 *                type: integer
 *                example: 1
 *                description: Office ID
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/get-schedule-available', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getScheduleAvailable(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/date-install-estimate:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service dateInstallEstimate.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              order_id:
 *                type: integer
 *                example: 1
 *                description: Order ID
 *              date_time:
 *                type: string
 *                example: '2022-07-01 10:00:00'
 *                description: Datetime
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/date-install-estimate', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.dateInstallEstimate(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/change-service:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service changeService.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              telno:
 *                type: string
 *                example: '0000j1234'
 *                description: Tel
 *              product_code:
 *                type: string
 *                example: 'FTTx'
 *                description: Product code
 *              offer_id:
 *                type: integer
 *                example: 6400950045
 *                description: Offer ID
 *              promotion_id:
 *                type: integer
 *                example: 2766
 *                description: Promotion ID
 *              speed:
 *                type: string
 *                example: '409600/409600'
 *                description: Speed
 *              service_name:
 *                type: string
 *                example: 'fttxhome400m'
 *                description: Service name
 *              date_change:
 *                type: string
 *                example: '2022-07-01 10:00:00'
 *                description: Date change
 *              change_by:
 *                type: string
 *                example: 'linedev/apiline'
 *                description: Change by
 *              note:
 *                type: string
 *                example: 'note'
 *                description: Note
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/change-service', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.changeService(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/cancle-order:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service cancleOrder.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              order_id:
 *                type: integer
 *                example: 1
 *                description: Order ID
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/cancle-order', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.cancleOrder(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

/**
 * @swagger
 * /api/fttx-external/insert-lead:
 *  post:
 *    tags: ["External FTTX"]
 *    description: External FTTX Service insertLead.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: 'linedev'
 *                description: Username
 *              password:
 *                type: string
 *                example: 'P@sslinedev'
 *                description: Password
 *              first_name:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: First name
 *              last_name:
 *                type: string
 *                example: 'ทดสอบ'
 *                description: Last name
 *              mobile:
 *                type: string
 *                example: '0847363636'
 *                description: Mobile
 *              date_install:
 *                type: string
 *                example: '2022-07-21 10:00:00'
 *                description: Date install
 *              latitude:
 *                type: string
 *                example: '13.825648997305056'
 *                description: Latitude
 *              longitude:
 *                type: string
 *                example: '100.53052425384521'
 *                description: Longitude
 *              address:
 *                type: string
 *                example: 'ที่อยู่'
 *                description: Address
 *              no:
 *                type: integer
 *                example: 29
 *                description: No
 *              village:
 *                type: string
 *                example: 'หมูบ้าน'
 *                description: Village
 *              building:
 *                type: string
 *                example: 'อาคาร'
 *                description: Building
 *              moo:
 *                type: string
 *                example: ''
 *                description: Moo
 *              soi:
 *                type: string
 *                example: 'ซอย'
 *                description: Soi
 *              road:
 *                type: string
 *                example: 'ถนน'
 *                description: Road
 *              province:
 *                type: string
 *                example: 'กรุงเทพมหานคร'
 *                description: Province
 *              district:
 *                type: string
 *                example: 'หลักสี่'
 *                description: District
 *              subdistrict:
 *                type: string
 *                example: 'ทุ่งสองห้อง'
 *                description: Subdistrict
 *              zip_code:
 *                type: integer
 *                example: 10210
 *                description: Zip code
 *              promotion_id:
 *                type: string
 *                example: ''
 *                description: Promotion ID
 *              speed_id:
 *                type: string
 *                example: ''
 *                description: Speed ID
 *              note:
 *                type: string
 *                example: ''
 *                description: Note
 *              device_id:
 *                type: string
 *                example: ''
 *                description: Device ID
 *              exchange_id:
 *                type: string
 *                example: ''
 *                description: Exchange ID
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/insert-lead', async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.insertLead(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    res.status(400).json({ status: 400, message: err });
  }
});

export default router;
