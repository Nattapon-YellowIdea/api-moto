import moment from 'moment-timezone';
import _ from 'lodash';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import registerService from '../services/registerService.service.js';
import { getProfile, pushMessage } from '../utils/line.js';
import registerServicePayForInstallationStatus from '../constant/nt/messages/register-service-pay-for-installation-status.js';
import registerServiceScheduleInstallationDate from '../constant/nt/messages/register-service-schedule-installation-date.js';
import registerServiceFindServiceCenter from '../constant/nt/messages/register-service-find-service-center.js';
import { replaceID } from '../utils/helper.js';
import fttxExternal from '../external/fttx.js';
import eServiceExternal from '../external/eService.js';
import crmExternal from '../external/crm.js';
import eServicePayment from '../constant/nt/messages/e-service-payment.js';
import eServiceService from '../services/e-service.service.js';
import termAndConditionService from '../services/termAndCondition.service.js';
import cmsExternal from '../external/cms.js';

const registerForm = async (req, res) => {
  try {
    const payload = req.body;

    let createOrderOrderId = '';
    let createOrderOrderCode = '';
    let createOrderCustomerId = '';
    let createOrderCustomerCode = '';
    let createOrderOrderStatusId = '';
    let createOrderWsStatusName = '';
    let createOrderwsStatusInt = '';
    let orderStatusId = '';
    let customerTitle = '';
    let paymentPaymentResult = '';
    let paymentSono = '';
    let paymentPaymentId = '';
    let paymentReceiveNo = '';
    let paymentCustomerId = '';
    let paymentOrderId = '';
    let paymentpaymentMethodsId = '';
    let paymentAmount = '';

    customerTitle = payload.customer_title;
    if (payload.customer_title === 'อื่นๆ (โปรดระบุ)') {
      customerTitle = payload.customer_title_optional;
    }

    const transaction = await registerService.findTransactionRegisterService({ _id: payload.form_id });
    if (transaction) {
      let customerSexName = '';
      if (transaction.customer_sex === 1) {
        customerSexName = 'Male';
      } else {
        customerSexName = 'Female';
      }
      if (Number(transaction.ws_status_int) === 1) {
        if (Number(transaction.distance) > -1 || Number(transaction.distance) < 301) {
          orderStatusId = 11;
        } else if (Number(transaction.distance) >= 300 && Number(transaction.distance) < 500) {
          orderStatusId = 1;
        } else if (Number(transaction.distance) >= 500 && Number(transaction.distance) < 1000) {
          orderStatusId = 2;
        }
      } else if (Number(transaction.ws_status_int) === 2) {
        orderStatusId = 2;
      } else if (Number(transaction.ws_status_int) === 3) {
        orderStatusId = 2;
      } else if (Number(transaction.ws_status_int) === 9) {
        orderStatusId = 2;
      }

      if (transaction.ws_status_int !== 7 && transaction.ws_status_int !== 8) {
        const payloadCreateOrders = {
          customer_code: '',
          personal_id: payload.personal_id,
          customer_sex: payload.customer_sex,
          customer_title: customerTitle,
          customer_first_name: payload.customer_first_name,
          customer_last_name: payload.customer_last_name,
          customer_address: '',
          customer_no: payload.customer_no,
          customer_village: '',
          customer_building: payload.customer_building,
          customer_moo: '',
          customer_soi: '',
          customer_road: payload.customer_road,
          customer_subdistrict: payload.customer_subdistrict,
          customer_district_id: payload.customer_district_id,
          customer_province_id: payload.customer_province_id,
          customer_zip: payload.customer_zip,
          customer_lat_lon: `${transaction.latitude},${transaction.longitude}`,
          customer_birthday_2: '',
          customer_email: payload.customer_email,
          customer_phoneno: '',
          customer_mobile: payload.customer_mobile,
          customer_customer_type_id: 1,
          order_address: '',
          order_no: payload.customer_no,
          order_village: '',
          order_building: payload.customer_building,
          order_moo: '',
          order_soi: '',
          order_road: payload.customer_road,
          order_subdistrict: payload.customer_subdistrict,
          order_district_id: payload.customer_district_id,
          order_province_id: payload.customer_province_id,
          order_postcode: payload.customer_zip,
          order_lat_lon: `${transaction.latitude},${transaction.longitude}`,
          order_office_id: Number(transaction.office_id),
          order_office_id_device: Number(transaction.office_id),
          order_office_id_number: Number(transaction.office_id),
          order_office_id_sale: Number(transaction.office_id),
          order_exchange_id: Number(transaction.exchange_id),
          order_device_id: Number(transaction.device_id),
          order_position: transaction.position,
          order_distance_estimated: Number(transaction.distance),
          crm_id: Number(transaction.promotion_offer_id),
          order_promotion_id: Number(transaction.promotion_promotion_id),
          order_package_id: Number(transaction.promotion_package_id),
          order_speed_id: transaction.promotion_speed_id,
          order_status_id: orderStatusId,
          ref_id: transaction._id,
          cost_maintenance: transaction.promotion_maintenance,
          cost_setup: transaction.promotion_setup,
          cost_fee: transaction.promotion_fee,
          cost_over_cable: transaction.promotion_over_cable,
          cost_ont: transaction.instrument_cost_ont,
          ont_int: transaction.instrument_ont_int,
          ca: '',
          permission_place: 0,
          polyline: transaction.polyline,
          speed: transaction.promotion_speed,
          service_name: transaction.promotion_service_name,
          dealer_id: '',
          date_time_eservice: moment.tz(new Date(transaction.updated_at), 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
          referer: '',
        };

        const result = await fttxExternal.getCreateOrdersNew(payloadCreateOrders);

        if (result.data) {
          if (result.data['soap-env:body']) {
            if (result.data['soap-env:body']['ns1:getcreateordersnewresponse']) {
              if (result.data['soap-env:body']['ns1:getcreateordersnewresponse'].return) {
                const { item } = result.data['soap-env:body']['ns1:getcreateordersnewresponse'].return;

                if (item instanceof Array) {
                  const wsStatusName = _.find(item, (o) => o.key === 'ws_status_name');

                  if (wsStatusName) {
                    createOrderWsStatusName = wsStatusName.value;
                  }

                  const wsStatusInt = _.find(item, (o) => o.key === 'ws_status_int');

                  if (wsStatusInt) {
                    createOrderwsStatusInt = wsStatusInt.value;
                    if (wsStatusInt.value === '6') {
                      const key0 = _.find(item, (o) => o.key === '0');

                      if (key0) {
                        const orderId = _.find(key0.value.item, (o) => o.key === 'order_id');

                        if (orderId) {
                          createOrderOrderId = orderId.value;
                        }

                        const orderCode = _.find(key0.value.item, (o) => o.key === 'order_code');

                        if (orderCode) {
                          createOrderOrderCode = orderCode.value;
                        }

                        const customerId = _.find(key0.value.item, (o) => o.key === 'customer_id');

                        if (customerId) {
                          createOrderCustomerId = customerId.value;
                        }

                        const customerCode = _.find(key0.value.item, (o) => o.key === 'customer_code');

                        if (customerCode) {
                          createOrderCustomerCode = customerCode.value;
                        }

                        const orderStatusId2 = _.find(key0.value.item, (o) => o.key === 'order_status_id');

                        if (orderStatusId2) {
                          createOrderOrderStatusId = orderStatusId2.value;
                        }
                      }
                    } else {
                      return res.status(400).json({ status: 400, message: createOrderWsStatusName });
                    }
                  }
                }
              }
            }
          }
        }
        await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
          customer_title: payload.customer_title,
          customer_sex: payload.customer_sex,
          customer_first_name: payload.customer_first_name,
          customer_last_name: payload.customer_last_name,
          personal_id: payload.personal_id,
          type_identity: (payload.personal_id.length === 13) ? 'yes' : 'no',
          customer_mobile: payload.customer_mobile,
          customer_email: payload.customer_email,
          customer_no: payload.customer_no,
          customer_building: payload.customer_building,
          customer_road: payload.customer_road,
          customer_subdistrict: payload.customer_subdistrict,
          customer_district_id: payload.customer_district_id,
          customer_province_id: payload.customer_province_id,
          customer_province: payload.province,
          customer_district: payload.district,
          customer_zip: payload.customer_zip,
          customer_title_optional: payload.customer_title_optional,
          last_activity: 'register-form',
          create_order_order_id: createOrderOrderId,
          create_order_order_code: createOrderOrderCode,
          create_order_customer_id: createOrderCustomerId,
          create_order_customer_code: createOrderCustomerCode,
          create_order_order_status_id: createOrderOrderStatusId,
          create_order_ws_status_name: createOrderWsStatusName,
          create_order_ws_status_int: createOrderwsStatusInt,
          updated_at: new Date(),
        });

        const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
          value: createOrderOrderCode,
        });

        const resultCheckOrderStatus2 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus);
        await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
          order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
          order_status_code: resultCheckOrderStatus2.orderStatusCode,
          order_status_sono: resultCheckOrderStatus2.orderStatusSono,
          order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
          order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
          order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
          order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
          order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
          order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
          order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
          order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
          order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
          order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
          order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
          order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
          order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
          order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
          order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
          updated_at: new Date(),
        });

        // Consent Update Here
        const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });
        let consentPayload = {};

        // null
        if (!userDetail) {
          const lineProfile = await getProfile(payload.line_user_id);

          consentPayload = {
            line_user_id: payload.line_user_id,
            tier: 1,
            socialid: '',
            displayname: lineProfile.displayName,
            mobile: '',
            email: '',
            idnumbertype: '',
            idnumber: '',
            is_activate: false,
            is_consent: payload.is_consent,
            consent_version: payload.consent_version,
          };

          await eServiceService.createMasterRegister(consentPayload);
          await termAndConditionService.createTransactionLogConsent(consentPayload);
        } else if (userDetail.consent_version !== payload.consent_version) {
          consentPayload.line_user_id = payload.line_user_id;
          consentPayload.tier = userDetail.tier;
          consentPayload.socialid = userDetail.socialid;
          consentPayload.displayname = userDetail.displayname;
          consentPayload.mobile = userDetail.mobile;
          consentPayload.email = userDetail.email;
          consentPayload.idnumbertype = userDetail.idnumbertype;
          consentPayload.idnumber = userDetail.idnumber;
          consentPayload.is_activate = userDetail.is_activate;
          consentPayload.is_consent = payload.is_consent;
          consentPayload.consent_version = payload.consent_version;

          await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, {
            updated_at: new Date(),
            is_consent: payload.is_consent,
            consent_version: payload.consent_version,
          });
          await termAndConditionService.createTransactionLogConsent(consentPayload);
        }

        const total = Number(resultCheckOrderStatus2.orderStatusCostSetup) + Number(resultCheckOrderStatus2.orderStatusCostFee) + Number(resultCheckOrderStatus2.orderStatusCostMaintenance) + Number(resultCheckOrderStatus2.orderStatusCostont) + Number(resultCheckOrderStatus2.orderStatusCostOverCable);

        if (total === 0) {
          const payloadPayments = {
            order_code: resultCheckOrderStatus2.orderStatusCode,
            payment_methods_id: 3,
            receive_no: resultCheckOrderStatus2.orderStatusCode,
            amount: total,
            comments: 'Comments',
            amount_device: total,
            same_install: 1,
            house_no: payload.customer_no,
            moo: '',
            village: '',
            soi: '',
            road: payload.customer_road,
            sub_district: payload.customer_subdistrict,
            district_id: payload.customer_district_id,
            province_id: payload.customer_province_id,
            zip: payload.customer_zip,
          };

          const resultPayments = await fttxExternal.getPayments(payloadPayments);

          if (resultPayments.data) {
            if (resultPayments.data['soap-env:body']) {
              if (resultPayments.data['soap-env:body']['ns1:getpaymentsresponse']) {
                if (resultPayments.data['soap-env:body']['ns1:getpaymentsresponse'].return) {
                  const { item } = resultPayments.data['soap-env:body']['ns1:getpaymentsresponse'].return;

                  if (item instanceof Array) {
                    const paymentResult = _.find(item, (o) => o.key === 'payment_result');

                    if (paymentResult) {
                      paymentPaymentResult = paymentResult.value;
                    }
                    const sono = _.find(item, (o) => o.key === 'sono');
                    if (sono) {
                      paymentSono = sono.value;
                    }
                    const paymentId = _.find(item, (o) => o.key === 'payment_id');
                    if (paymentId) {
                      paymentPaymentId = paymentId.value;
                    }
                    const receiveNo = _.find(item, (o) => o.key === 'receive_no');
                    if (receiveNo) {
                      paymentReceiveNo = receiveNo.value;
                    }
                    const customerId = _.find(item, (o) => o.key === 'customer_id');
                    if (customerId) {
                      paymentCustomerId = customerId.value;
                    }
                    const orderId = _.find(item, (o) => o.key === 'order_id');
                    if (orderId) {
                      paymentOrderId = orderId.value;
                    }
                    const paymentMethodsId = _.find(item, (o) => o.key === 'payment_methods_id');
                    if (paymentMethodsId) {
                      paymentpaymentMethodsId = paymentMethodsId.value;
                    }
                    const amount = _.find(item, (o) => o.key === 'amount');
                    if (amount) {
                      paymentAmount = amount.value;
                    }
                  }
                }
              }
            }
          }

          if (paymentPaymentResult === 'Completed, บันทึกรายการชำระเงิน สำเร็จ') {
            const resultCheckOrderStatus3 = await fttxExternal.getCheckOrderStatus({
              value: createOrderOrderCode,
            });

            const resultCheckOrderStatus4 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus3);
            await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
              order_status_order_id: resultCheckOrderStatus4.orderStatusOrderId,
              order_status_code: resultCheckOrderStatus4.orderStatusCode,
              order_status_sono: resultCheckOrderStatus4.orderStatusSono,
              order_status_status_id: resultCheckOrderStatus4.orderStatusStatusId,
              order_status_status_name: resultCheckOrderStatus4.orderStatusStatusName,
              order_status_is_paid: resultCheckOrderStatus4.orderStatusIsPaid,
              order_status_promotion_name: resultCheckOrderStatus4.orderStatusPromotionName,
              order_status_package_name: resultCheckOrderStatus4.orderStatusPackageName,
              order_status_speed: resultCheckOrderStatus4.orderStatusSpeed,
              order_status_fullname: resultCheckOrderStatus4.orderStatusFullname,
              order_status_filename: resultCheckOrderStatus4.orderStatusFilename,
              order_status_office_id: resultCheckOrderStatus4.orderStatusOfficeId,
              order_status_cost_setup: resultCheckOrderStatus4.orderStatusCostSetup,
              order_status_cost_fee: resultCheckOrderStatus4.orderStatusCostFee,
              order_status_cost_maintenance: resultCheckOrderStatus4.orderStatusCostMaintenance,
              order_status_cost_ont: resultCheckOrderStatus4.orderStatusCostont,
              order_status_cost_over_cable: resultCheckOrderStatus4.orderStatusCostOverCable,
              order_status_customer_mobile: resultCheckOrderStatus4.orderStatusCustomerMobile,
              payment_payment_result: paymentPaymentResult,
              payment_sono: paymentSono,
              payment_payment_id: paymentPaymentId,
              payment_receive_no: paymentReceiveNo,
              payment_customer_id: paymentCustomerId,
              payment_order_id: paymentOrderId,
              payment_payment_methods_id: paymentpaymentMethodsId,
              payment_amount: paymentAmount,
              updated_at: new Date(),
            });
            const arrayContent = [];
            let totalInstrument = 0.00;
            const vat = 7;
            const speed = resultCheckOrderStatus2.orderStatusSpeed;
            const speedArray = speed.split('/');
            const speed1 = Number(speedArray[0] / 1024);
            const speed2 = Number(speedArray[1] / 1024);
            const speedName = `${speed1}/${speed2}`;

            arrayContent.push(
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'แพ็กเกจ NT Broadbrand ที่ท่านสมัคร',
                    align: 'start',
                    weight: 'bold',
                    wrap: true,
                    flex: 2,
                  },
                  {
                    type: 'image',
                    url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Logo.png?w=1040`,
                    size: 'xs',
                    align: 'end',
                    gravity: 'top',
                    aspectRatio: '5:4',
                  },
                ],
                alignItems: 'center',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    align: 'start',
                    weight: 'regular',
                    wrap: true,
                    flex: 2,
                    size: 'sm',
                    text: 'กรุณาเลือกวันนัดหมายติดตั้ง',
                  },
                ],
                alignItems: 'center',
                margin: 'md',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'หมายเลขอ้างอิง',
                    size: 'sm',
                    weight: 'bold',
                  },
                  {
                    type: 'text',
                    text: `${createOrderOrderCode}`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'xxl',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'แพ็กเกจ',
                    size: 'sm',
                    color: '#545859',
                  },
                  {
                    type: 'text',
                    text: `${String(resultCheckOrderStatus2.orderStatusPromotionName)}`,
                    size: 'sm',
                    align: 'end',
                    adjustMode: 'shrink-to-fit',
                    color: '#545859',
                  },
                ],
                margin: 'lg',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ความเร็ว',
                    size: 'sm',
                    color: '#545859',
                  },
                  {
                    type: 'text',
                    text: `${String(speedName)} Mbps`,
                    size: 'sm',
                    align: 'end',
                    color: '#545859',
                  },
                ],
                margin: 'lg',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ค่าบริการ',
                    size: 'sm',
                    color: '#545859',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat(transaction.promotion_price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    adjustMode: 'shrink-to-fit',
                    color: '#545859',
                  },
                ],
                margin: 'lg',
              },
              {
                type: 'separator',
                margin: 'md',
              },
            );

            if (transaction.promotion_fee > 0) {
              totalInstrument += transaction.promotion_fee + (transaction.promotion_fee * vat) / 100;
              arrayContent.push({
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    size: 'sm',
                    text: 'ค่าแรกเข้า',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat((transaction.promotion_fee + (transaction.promotion_fee * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'lg',
              });
            }

            if (transaction.instrument_cost_ont > 0) {
              totalInstrument += transaction.instrument_cost_ont + (transaction.instrument_cost_ont * vat) / 100;
              arrayContent.push({
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ค่าอุปกรณ์/ONU',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat((transaction.instrument_cost_ont + (transaction.instrument_cost_ont * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'lg',
              });
            }

            if (transaction.promotion_over_cable > 0) {
              totalInstrument += transaction.promotion_over_cable + (transaction.promotion_over_cable * vat) / 100;
              arrayContent.push({
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ค่าทางสายเกิน',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat((transaction.promotion_over_cable + (transaction.promotion_over_cable * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'lg',
              });
            }

            if (transaction.promotion_maintenance > 0) {
              totalInstrument += transaction.promotion_maintenance + (transaction.promotion_maintenance * vat) / 100;
              arrayContent.push({
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ค่าช่าง',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat((transaction.promotion_maintenance + (transaction.promotion_maintenance * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'lg',
              });
            }

            if (transaction.promotion_setup > 0) {
              totalInstrument += transaction.promotion_setup + (transaction.promotion_setup * vat) / 100;
              arrayContent.push({
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'ค่าติดตั้ง',
                    size: 'sm',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat((transaction.promotion_setup + (transaction.promotion_setup * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                    size: 'sm',
                    align: 'end',
                    weight: 'bold',
                    adjustMode: 'shrink-to-fit',
                  },
                ],
                margin: 'lg',
              });
            }

            if (transaction.promotion_fee > 0 || transaction.instrument_cost_ont > 0 || transaction.promotion_over_cable > 0 || transaction.promotion_maintenance > 0 || transaction.promotion_setup > 0) {
              arrayContent.push(
                {
                  type: 'separator',
                  margin: 'md',
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: 'สรุปค่าติดตั้งอุปกรณ์',
                      size: 'sm',
                      weight: 'bold',
                      flex: 4,
                      adjustMode: 'shrink-to-fit',
                    },
                    {
                      type: 'text',
                      text: `${String(Number.parseFloat(totalInstrument).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                      size: 'md',
                      align: 'end',
                      weight: 'bold',
                      flex: 3,
                      color: '#003294',
                      gravity: 'center',
                    },
                    {
                      type: 'text',
                      text: 'บาท',
                      size: 'xs',
                      align: 'end',
                      weight: 'bold',
                      color: '#003294',
                      gravity: 'center',
                    },
                  ],
                  margin: 'xl',
                },
              );
            } else {
              arrayContent.push(
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: 'สรุปค่าติดตั้งอุปกรณ์',
                      size: 'sm',
                      weight: 'bold',
                      flex: 4,
                      adjustMode: 'shrink-to-fit',
                    },
                    {
                      type: 'text',
                      text: `${String(Number.parseFloat(totalInstrument).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                      size: 'md',
                      align: 'end',
                      weight: 'bold',
                      flex: 3,
                      color: '#003294',
                      gravity: 'center',
                    },
                    {
                      type: 'text',
                      text: 'บาท',
                      size: 'xs',
                      align: 'end',
                      weight: 'bold',
                      color: '#003294',
                      gravity: 'center',
                    },
                  ],
                  margin: 'xl',
                },
              );
            }

            pushMessage(transaction.line_user_id, [
              {
                type: 'flex',
                altText: 'ใบบันทึกรายการ',
                contents: {
                  type: 'carousel',
                  contents: [
                    {
                      type: 'bubble',
                      size: 'mega',
                      body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: arrayContent,
                      },
                      footer: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'button',
                            action: {
                              type: 'uri',
                              label: 'เลือกวันนัดหมาย',
                              uri: `${process.env.LINE_LIFF_100}/register/appointment?order_code=${createOrderOrderCode}`,
                              altUri: {
                                desktop: `${process.env.LINE_LIFF_100}/register/appointment?order_code=${createOrderOrderCode}`,
                              },
                            },
                            style: 'secondary',
                            color: '#FFD100',
                            height: 'sm',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ]);

            // Store Data To tagging method
            await cmsExternal.dataPillar([
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Product',
                definition: 'Package NT Broadband',
                data_point: transaction.promotion_name,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Product',
                definition: 'ONT',
                data_point: String(transaction.instrument_ont_int),
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Product',
                definition: 'Province',
                data_point: payload.province,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'First name',
                data_point: payload.customer_first_name,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Last name',
                data_point: payload.customer_last_name,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Phone number',
                data_point: payload.customer_mobile,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Email',
                data_point: payload.customer_email,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'House number',
                data_point: payload.customer_no,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Zip code',
                data_point: payload.customer_zip,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Gender',
                data_point: customerSexName,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Province',
                data_point: payload.province,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'District',
                data_point: payload.district,
              },
              {
                line_user_id: payload.line_user_id,
                line_display_name: '',
                line_display_image: '',
                data_pillar: 'Profile',
                definition: 'Sub-district',
                data_point: payload.customer_subdistrict,
              },
            ]);

            return res.status(200).json({ status: 200, message: 'Succesfully', data: { id: transaction._id } });
          }
          return res.status(400).json({ status: 400, message: 'Get Payment Error.' });
        }
        // ค่าอุปกรณ์/ONU instrument_cost_ont
        // ค่าแรกเข้า promotion_fee
        // ค่าทางสายเกิน promotion_over_cable
        // ค่าช่าง promotion_maintenance
        // ค่าติดตั้ง promotion_setup

        // order_status_cost_fee: "9" ค่าแรกเข้า
        // order_status_cost_maintenance: "0" ค่าบำรุงรักษา
        // order_status_cost_ont: "0" ค่าอุปกรณ์ onu
        // order_status_cost_over_cable: "0" ค่าสายเกิน
        // order_status_cost_setup: "0" ค่าติดตั้ง

        if (createOrderOrderStatusId === 'รอชำระค่าติดตั้ง') {
          const arrayContent = [];
          let totalInstrument = 0.00;
          const vat = 7;
          const speed = resultCheckOrderStatus2.orderStatusSpeed;
          const speedArray = speed.split('/');
          const speed1 = Number(speedArray[0] / 1024);
          const speed2 = Number(speedArray[1] / 1024);
          const speedName = `${speed1}/${speed2}`;

          arrayContent.push(
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'แพ็กเกจ NT Broadbrand ที่ท่านสมัคร',
                  align: 'start',
                  weight: 'bold',
                  wrap: true,
                  flex: 2,
                },
                {
                  type: 'image',
                  url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Logo.png?w=1040`,
                  size: 'xs',
                  align: 'end',
                  gravity: 'top',
                  aspectRatio: '5:4',
                },
              ],
              alignItems: 'center',
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  align: 'start',
                  weight: 'regular',
                  wrap: true,
                  flex: 2,
                  size: 'sm',
                  text: 'กรุณากดชำระเงิน เพื่อดำเนินการขั้นตอนต่อไป',
                },
              ],
              alignItems: 'center',
              margin: 'md',
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'หมายเลขอ้างอิง',
                  size: 'sm',
                  weight: 'bold',
                },
                {
                  type: 'text',
                  text: `${createOrderOrderCode}`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'xxl',
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'แพ็กเกจ',
                  size: 'sm',
                  color: '#545859',
                },
                {
                  type: 'text',
                  text: `${String(resultCheckOrderStatus2.orderStatusPromotionName)}`,
                  size: 'sm',
                  align: 'end',
                  adjustMode: 'shrink-to-fit',
                  color: '#545859',
                },
              ],
              margin: 'lg',
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ความเร็ว',
                  size: 'sm',
                  color: '#545859',
                },
                {
                  type: 'text',
                  text: `${String(speedName)} Mbps`,
                  size: 'sm',
                  align: 'end',
                  color: '#545859',
                },
              ],
              margin: 'lg',
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ค่าบริการ',
                  size: 'sm',
                  color: '#545859',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat(transaction.promotion_price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  adjustMode: 'shrink-to-fit',
                  color: '#545859',
                },
              ],
              margin: 'lg',
            },
            {
              type: 'separator',
              margin: 'md',
            },
          );

          if (transaction.promotion_fee > 0) {
            totalInstrument += transaction.promotion_fee + (transaction.promotion_fee * vat) / 100;
            arrayContent.push({
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  size: 'sm',
                  text: 'ค่าแรกเข้า',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat((transaction.promotion_fee + (transaction.promotion_fee * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'lg',
            });
          }

          if (transaction.instrument_cost_ont > 0) {
            totalInstrument += transaction.instrument_cost_ont + (transaction.instrument_cost_ont * vat) / 100;
            arrayContent.push({
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ค่าอุปกรณ์/ONU',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat((transaction.instrument_cost_ont + (transaction.instrument_cost_ont * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'lg',
            });
          }

          if (transaction.promotion_over_cable > 0) {
            totalInstrument += transaction.promotion_over_cable + (transaction.promotion_over_cable * vat) / 100;
            arrayContent.push({
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ค่าทางสายเกิน',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat((transaction.promotion_over_cable + (transaction.promotion_over_cable * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'lg',
            });
          }

          if (transaction.promotion_maintenance > 0) {
            totalInstrument += transaction.promotion_maintenance + (transaction.promotion_maintenance * vat) / 100;
            arrayContent.push({
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ค่าช่าง',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat((transaction.promotion_maintenance + (transaction.promotion_maintenance * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'lg',
            });
          }

          if (transaction.promotion_setup > 0) {
            totalInstrument += transaction.promotion_setup + (transaction.promotion_setup * vat) / 100;
            arrayContent.push({
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'ค่าติดตั้ง',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: `${String(Number.parseFloat((transaction.promotion_setup + (transaction.promotion_setup * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท`,
                  size: 'sm',
                  align: 'end',
                  weight: 'bold',
                  adjustMode: 'shrink-to-fit',
                },
              ],
              margin: 'lg',
            });
          }

          if (transaction.promotion_fee > 0 || transaction.instrument_cost_ont > 0 || transaction.promotion_over_cable > 0 || transaction.promotion_maintenance > 0 || transaction.promotion_setup > 0) {
            arrayContent.push(
              {
                type: 'separator',
                margin: 'md',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'สรุปค่าติดตั้งอุปกรณ์',
                    size: 'sm',
                    weight: 'bold',
                    flex: 4,
                    adjustMode: 'shrink-to-fit',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat(totalInstrument).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                    size: 'md',
                    align: 'end',
                    weight: 'bold',
                    flex: 3,
                    color: '#003294',
                    gravity: 'center',
                  },
                  {
                    type: 'text',
                    text: 'บาท',
                    size: 'xs',
                    align: 'end',
                    weight: 'bold',
                    color: '#003294',
                    gravity: 'center',
                  },
                ],
                margin: 'xl',
              },
            );
          } else {
            arrayContent.push(
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'สรุปค่าติดตั้งอุปกรณ์',
                    size: 'sm',
                    weight: 'bold',
                    flex: 4,
                    adjustMode: 'shrink-to-fit',
                  },
                  {
                    type: 'text',
                    text: `${String(Number.parseFloat(totalInstrument).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                    size: 'md',
                    align: 'end',
                    weight: 'bold',
                    flex: 3,
                    color: '#003294',
                    gravity: 'center',
                  },
                  {
                    type: 'text',
                    text: 'บาท',
                    size: 'xs',
                    align: 'end',
                    weight: 'bold',
                    color: '#003294',
                    gravity: 'center',
                  },
                ],
                margin: 'xl',
              },
            );
          }

          pushMessage(transaction.line_user_id, [
            {
              type: 'flex',
              altText: 'ใบบันทึกรายการ',
              contents: {
                type: 'carousel',
                contents: [
                  {
                    type: 'bubble',
                    size: 'mega',
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: arrayContent,
                    },
                    footer: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'button',
                          action: {
                            type: 'uri',
                            label: 'ชำระเงิน',
                            uri: `${process.env.LINE_LIFF_100}/register/payment/summary?order_code=${createOrderOrderCode}`,
                            altUri: {
                              desktop: `${process.env.LINE_LIFF_100}/register/payment/summary?order_code=${createOrderOrderCode}`,
                            },
                          },
                          style: 'secondary',
                          color: '#FFD100',
                          height: 'sm',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ]);
          await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
            order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
            order_status_code: resultCheckOrderStatus2.orderStatusCode,
            order_status_sono: resultCheckOrderStatus2.orderStatusSono,
            order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
            order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
            order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
            order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
            order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
            order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
            order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
            order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
            order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
            order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
            order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
            order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
            order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
            order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
            order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
            updated_at: new Date(),
          });
          // Store Data To tagging method
          await cmsExternal.dataPillar([
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Product',
              definition: 'Package NT Broadband',
              data_point: transaction.promotion_name,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Product',
              definition: 'ONT',
              data_point: String(transaction.instrument_ont_int),
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Product',
              definition: 'Province',
              data_point: payload.province,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'First name',
              data_point: payload.customer_first_name,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Last name',
              data_point: payload.customer_last_name,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Phone number',
              data_point: payload.customer_mobile,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Email',
              data_point: payload.customer_email,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'House number',
              data_point: payload.customer_no,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Zip code',
              data_point: payload.customer_zip,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Gender',
              data_point: customerSexName,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Province',
              data_point: payload.province,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'District',
              data_point: payload.district,
            },
            {
              line_user_id: payload.line_user_id,
              line_display_name: '',
              line_display_image: '',
              data_pillar: 'Profile',
              definition: 'Sub-district',
              data_point: payload.customer_subdistrict,
            },
          ]);
          return res.status(200).json({ status: 200, message: 'Succesfully', data: { id: transaction._id } });
        }
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: { id: transaction._id } });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const payForInstallation = async (req, res) => {
  try {
    const payload = req.body;

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: 'NT ขอบคุณสำหรับการชำระค่าติดตั้งอุปกรณ์ หมายเลข F123456789',
      },
      registerServicePayForInstallationStatus(),
      {
        type: 'text',
        text: 'กรุณาเลือกวันนัดหมายติดตั้ง  NT BROADBAND',
      },
      registerServiceScheduleInstallationDate(),
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const scheduleInstallationDate = async (req, res) => {
  try {
    const payload = req.body;

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: 'ขอบคุณที่สมัครบริการ NT BROADBAND รายละเอียดการสมัคร เบอร์: 098-765-4321 แพ็กเกจ: NT ValueMax Fiber 600/600 Mbps 490 บาท วันนัดหมาย 24 พฤศจิกายน 2564 (ช่วงเช้า) หมายเลขติดตามสถานะการติดตั้ง SR-00000001 หมายเหตุ* อาจมีค่าเดินสายเพิ่มเติม ภายหลังในวันติดตั้งหากระยะสายไกลเกินกว่า 300 เมตร',
      },
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const leadFrom = async (req, res) => {
  try {
    const payload = req.body;
    const payloadInsertLead = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      mobile: payload.mobile,
      date_install: payload.date_install,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      no: payload.no,
      village: payload.village,
      building: payload.building,
      moo: payload.moo,
      soi: payload.soi,
      road: payload.road,
      province: payload.province,
      district: payload.district,
      subdistrict: payload.subdistrict,
      zip_code: payload.zip_code,
      promotion_id: payload.promotion_id,
      speed_id: payload.speed_id,
      note: payload.note,
      device_id: payload.device_id,
      exchange_id: payload.exchange_id,
    };

    const result = await fttxExternal.insertLead(payloadInsertLead);

    if (result.data) {
      if (result.data['soap-env:body']) {
        if (result.data['soap-env:body']['ns1:insertleadresponse']) {
          if (result.data['soap-env:body']['ns1:insertleadresponse'].return) {
            if (result.data['soap-env:body']['ns1:insertleadresponse'].return.item) {
              const { item } = result.data['soap-env:body']['ns1:insertleadresponse'].return;
              if (item instanceof Array) {
                const wsStatusName = _.find(item, (o) => o.key === 'ws_status_name');
                const refCode = _.find(item, (o) => o.key === 'ref_code');
                payload.ws_status_name = wsStatusName.value;
                payload.ref_code = refCode.value;
                await registerService.createLeadForm(payload);

                if (wsStatusName) {
                  if (wsStatusName.value === 'บันทึกข้อมูลสำเร็จ') {
                    pushMessage(payload.line_user_id, [
                      {
                        type: 'text',
                        text: 'ขอบคุณที่ให้ความสนใจ NT\n กรุณารอการติดต่อกลับจากเจ้าหน้าที่',
                      },
                    ]);
                    return res.status(200).json({ status: 200, message: 'Succesfully' });
                  }
                  return res.status(200).json({ status: 200, message: wsStatusName });
                }
              }
            }
          }
        }
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const checkBlacklist = async (req, res) => {
  try {
    const payload = req.body;
    const datenow = moment.tz(new Date(), 'Asia/Bangkok');
    datenow.add(543, 'years');
    const payloadcrmQueryCaForAllPs = {
      personalId: (payload.type === 'cid') ? payload.cid : payload.passport,
      transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
      integrationKeyRef: 'LINEAPP',
      IsCitizenId: (payload.type === 'cid') ? 1 : 2,
      line_user_id: payload.line_user_id,
    };
    const result = await crmExternal.crmQueryCaForAllPs(payloadcrmQueryCaForAllPs);

    let customerid = '';
    let title = '';
    let fname = '';
    let lname = '';
    let caStatus = '';
    let caBlacklist = '';
    let customertypecode = '';
    let customertypename = '';
    let customersubtypecode = '';
    let customersubtypename = '';
    let customerclass = '';
    let companytitle = '';
    let companyname = '';
    let companybranch = '';
    let governmentcode = '';
    let createddatetime = '';
    let emailaddress = '';
    let passportno = '';
    let registrationid = '';
    let citizenid = '';
    let caTaxid = '';
    let rootcustomerid = '';
    let parentcustomerid = '';
    let caMobileno1 = '';
    let caMobileno2 = '';
    let telephoneno = '';
    let telephoneextensionno = '';
    let faxno = '';
    let caConsentpdpa = '';
    let addrId = '';
    let code = '';
    let no = '';
    let roomno = '';
    let floorno = '';
    let villagename = '';
    let buildingname = '';
    let moo = '';
    let soi = '';
    let road = '';
    let subdistrictname = '';
    let districtname = '';
    let provincename = '';
    let zipcode = '';
    let countryname = '';
    let baFirstname = '';
    let baLastname = '';

    if (result.data) {
      if (result.data['soapenv:body']) {
        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']) {
          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']) {
            if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']) {
              if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']) {
                if (Array.isArray(result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']) === true) {
                  if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']) {
                    if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']['crm1:responsedesc']) {
                      if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']['crm1:responsedesc'] === 'SUCCESS') {
                        const item = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca'];

                        const item0 = _.head(item);

                        if (item0['crm1:customerid']) {
                          customerid = item0['crm1:customerid'];
                        }
                        if (item0['crm1:title']) {
                          title = item0['crm1:title'];
                        }
                        if (item0['crm1:fname']) {
                          fname = item0['crm1:fname'];
                        }
                        if (item0['crm1:lname']) {
                          lname = item0['crm1:lname'];
                        }
                        if (item0['crm1:ca_status']) {
                          caStatus = item0['crm1:ca_status'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']) {
                          caBlacklist = 'No';
                          result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca'].forEach((element) => {
                            if (element['crm1:ca_blacklist'] === 'Yes') {
                              caBlacklist = 'Yes';
                            }
                          });
                        }
                        if (item0['crm1:customertypecode']) {
                          customertypecode = item0['crm1:customertypecode'];
                        }
                        if (item0['crm1:customertypename']) {
                          customertypename = item0['crm1:customertypename'];
                        }
                        if (item0['crm1:customersubtypecode']) {
                          customersubtypecode = item0['crm1:customersubtypecode'];
                        }
                        if (item0['crm1:customersubtypename']) {
                          customersubtypename = item0['crm1:customersubtypename'];
                        }
                        if (item0['crm1:customerclass']) {
                          customerclass = item0['crm1:customerclass'];
                        }
                        if (item0['crm1:companytitle']) {
                          companytitle = item0['crm1:companytitle'];
                        }
                        if (item0['crm1:companyname']) {
                          companyname = item0['crm1:companyname'];
                        }
                        if (item0['crm1:companybranch']) {
                          companybranch = item0['crm1:companybranch'];
                        }
                        if (item0['crm1:governmentcode']) {
                          governmentcode = item0['crm1:governmentcode'];
                        }
                        if (item0['crm1:createddatetime']) {
                          createddatetime = item0['crm1:createddatetime'];
                        }
                        if (item0['crm1:emailaddress']) {
                          emailaddress = item0['crm1:emailaddress'];
                        }
                        if (item0['crm1:passportno']) {
                          passportno = item0['crm1:passportno'];
                        }
                        if (item0['crm1:registrationid']) {
                          registrationid = item0['crm1:registrationid'];
                        }
                        if (item0['crm1:citizenid']) {
                          citizenid = item0['crm1:citizenid'];
                        }
                        if (item0['crm1:ca_taxid']) {
                          caTaxid = item0['crm1:ca_taxid'];
                        }
                        if (item0['crm1:rootcustomerid']) {
                          rootcustomerid = item0['crm1:rootcustomerid'];
                        }
                        if (item0['crm1:parentcustomerid']) {
                          parentcustomerid = item0['crm1:parentcustomerid'];
                        }
                        if (item0['crm1:ca_mobileno1']) {
                          caMobileno1 = item0['crm1:ca_mobileno1'];
                        }
                        if (item0['crm1:ca_mobileno2']) {
                          caMobileno2 = item0['crm1:ca_mobileno2'];
                        }
                        if (item0['crm1:telephoneno']) {
                          telephoneno = item0['crm1:telephoneno'];
                        }
                        if (item0['crm1:telephoneextensionno']) {
                          telephoneextensionno = item0['crm1:telephoneextensionno'];
                        }
                        if (item0['crm1:faxno']) {
                          faxno = item0['crm1:faxno'];
                        }
                        if (item0['crm1:ca_consentpdpa']) {
                          caConsentpdpa = item0['crm1:ca_consentpdpa'];
                        }
                        if (item0['crm1:legaladdr']) {
                          if (item0['crm1:legaladdr']['crm1:addr_id']) {
                            addrId = item0['crm1:legaladdr']['crm1:addr_id'];
                          }
                          if (item0['crm1:legaladdr']['crm1:code']) {
                            code = item0['crm1:legaladdr']['crm1:code'];
                          }
                          if (item0['crm1:legaladdr']['crm1:no']) {
                            no = item0['crm1:legaladdr']['crm1:no'];
                          }
                          if (item0['crm1:legaladdr']['crm1:roomno']) {
                            roomno = item0['crm1:legaladdr']['crm1:roomno'];
                          }
                          if (item0['crm1:legaladdr']['crm1:floorno']) {
                            floorno = item0['crm1:legaladdr']['crm1:floorno'];
                          }
                          if (item0['crm1:legaladdr']['crm1:villagename']) {
                            villagename = item0['crm1:legaladdr']['crm1:villagename'];
                          }
                          if (item0['crm1:legaladdr']['crm1:buildingname']) {
                            buildingname = item0['crm1:legaladdr']['crm1:buildingname'];
                          }
                          if (item0['crm1:legaladdr']['crm1:moo']) {
                            moo = item0['crm1:legaladdr']['crm1:moo'];
                          }
                          if (item0['crm1:legaladdr']['crm1:soi']) {
                            soi = item0['crm1:legaladdr']['crm1:soi'];
                          }
                          if (item0['crm1:legaladdr']['crm1:road']) {
                            road = item0['crm1:legaladdr']['crm1:road'];
                          }
                          if (item0['crm1:legaladdr']['crm1:subdistrictname']) {
                            subdistrictname = item0['crm1:legaladdr']['crm1:subdistrictname'];
                          }
                          if (item0['crm1:legaladdr']['crm1:districtname']) {
                            districtname = item0['crm1:legaladdr']['crm1:districtname'];
                          }
                          if (item0['crm1:legaladdr']['crm1:provincename']) {
                            provincename = item0['crm1:legaladdr']['crm1:provincename'];
                          }
                          if (item0['crm1:legaladdr']['crm1:zipcode']) {
                            zipcode = item0['crm1:legaladdr']['crm1:zipcode'];
                          }
                          if (item0['crm1:legaladdr']['crm1:countryname']) {
                            countryname = item0['crm1:legaladdr']['crm1:countryname'];
                          }

                          if (caBlacklist === 'Yes') {
                            pushMessage(payload.line_user_id, [
                              {
                                type: 'text',
                                text: 'ไม่สามารถสมัครบริการได้ กรุณาติดต่อที่ศูนย์บริการ',
                              },
                              registerServiceFindServiceCenter(),
                            ]);
                          }
                        }

                        if (item0['crm1:ba']) {
                          if (Array.isArray(item0['crm1:ba'])) {
                            const itemBa = _.head(item0['crm1:ba']);
                            if (itemBa['crm1:ba_firstname']) {
                              baFirstname = itemBa['crm1:ba_firstname'];
                            }
                            if (itemBa['crm1:ba_lastname']) {
                              baLastname = itemBa['crm1:ba_lastname'];
                            }
                          } else {
                            if (item0['crm1:ba']['crm1:ba_firstname']) {
                              baFirstname = item0['crm1:ba']['crm1:ba_firstname'];
                            }
                            if (item0['crm1:ba']['crm1:ba_lastname']) {
                              baLastname = item0['crm1:ba']['crm1:ba_lastname'];
                            }
                          }
                        }
                      }
                    }
                  }
                }

                if (Array.isArray(result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']) === false) {
                  if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']) {
                    if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']['crm1:responsedesc']) {
                      if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:responseresult']['crm1:responsedesc'] === 'SUCCESS') {
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customerid']) {
                          customerid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customerid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:title']) {
                          title = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:title'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:fname']) {
                          fname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:fname'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:lname']) {
                          lname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:lname'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_status']) {
                          caStatus = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_status'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_blacklist']) {
                          caBlacklist = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_blacklist'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customertypecode']) {
                          customertypecode = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customertypecode'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customertypename']) {
                          customertypename = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customertypename'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customersubtypecode']) {
                          customersubtypecode = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customersubtypecode'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customersubtypename']) {
                          customersubtypename = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customersubtypename'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customerclass']) {
                          customerclass = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:customerclass'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companytitle']) {
                          companytitle = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companytitle'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companyname']) {
                          companyname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companyname'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companybranch']) {
                          companybranch = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:companybranch'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:governmentcode']) {
                          governmentcode = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:governmentcode'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:createddatetime']) {
                          createddatetime = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:createddatetime'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:emailaddress']) {
                          emailaddress = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:emailaddress'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:passportno']) {
                          passportno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:passportno'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:registrationid']) {
                          registrationid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:registrationid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:citizenid']) {
                          citizenid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:citizenid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_taxid']) {
                          caTaxid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_taxid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:rootcustomerid']) {
                          rootcustomerid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:rootcustomerid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:parentcustomerid']) {
                          parentcustomerid = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:parentcustomerid'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_mobileno1']) {
                          caMobileno1 = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_mobileno1'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_mobileno2']) {
                          caMobileno2 = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_mobileno2'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:telephoneno']) {
                          telephoneno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:telephoneno'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:telephoneextensionno']) {
                          telephoneextensionno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:telephoneextensionno'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:faxno']) {
                          faxno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:faxno'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_consentpdpa']) {
                          caConsentpdpa = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ca_consentpdpa'];
                        }
                        if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']) {
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:addr_id']) {
                            addrId = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:addr_id'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:code']) {
                            code = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:code'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:no']) {
                            no = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:no'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:roomno']) {
                            roomno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:roomno'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:floorno']) {
                            floorno = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:floorno'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:villagename']) {
                            villagename = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:villagename'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:buildingname']) {
                            buildingname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:buildingname'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:moo']) {
                            moo = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:moo'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:soi']) {
                            soi = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:soi'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:road']) {
                            road = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:road'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:subdistrictname']) {
                            subdistrictname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:subdistrictname'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:districtname']) {
                            districtname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:districtname'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:provincename']) {
                            provincename = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:provincename'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:zipcode']) {
                            zipcode = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:zipcode'];
                          }
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:countryname']) {
                            countryname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:legaladdr']['crm1:countryname'];
                          }
                          // add firstname lastname
                          if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']) {
                            if (Array.isArray(result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba'])) {
                              const itemBa = _.head(result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']);
                              if (itemBa['crm1:ba_firstname']) {
                                baFirstname = itemBa['crm1:ba_firstname'];
                              }
                              if (itemBa['crm1:ba_lastname']) {
                                baLastname = itemBa['crm1:ba_lastname'];
                              }
                            } else {
                              if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']['crm1:ba_firstname']) {
                                baFirstname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']['crm1:ba_firstname'];
                              }
                              if (result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']['crm1:ba_lastname']) {
                                baLastname = result.data['soapenv:body']['crm:crm_querycaforall_psresponse']['crm1:crm_querycaforallresponse']['crm1:body']['crm1:ca']['crm1:ba']['crm1:ba_lastname'];
                              }
                            }
                          }
                          if (caBlacklist === 'Yes') {
                            pushMessage(payload.line_user_id, [
                              {
                                type: 'text',
                                text: 'ไม่สามารถสมัครบริการได้ กรุณาติดต่อที่ศูนย์บริการ',
                              },
                              registerServiceFindServiceCenter(),
                            ]);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'Succesfully',
      data: {
        customerid,
        title,
        fname,
        lname,
        ca_status: caStatus,
        ca_blacklist: caBlacklist,
        customertypecode,
        customertypename,
        customersubtypecode,
        customersubtypename,
        customerclass,
        companytitle,
        companyname,
        companybranch,
        governmentcode,
        createddatetime,
        emailaddress,
        passportno,
        registrationid,
        citizenid,
        ca_taxid: caTaxid,
        rootcustomerid,
        parentcustomerid,
        ca_mobileno1: caMobileno1,
        ca_mobileno2: caMobileno2,
        telephoneno,
        telephoneextensionno,
        faxno,
        ca_consentpdpa: caConsentpdpa,
        addr_id: addrId,
        code,
        no,
        roomno,
        floorno,
        villagename,
        buildingname,
        moo,
        soi,
        road,
        subdistrictname,
        districtname,
        provincename,
        zipcode,
        countryname,
        baFirstname,
        baLastname,
      },
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getDetailRegisterService = async (req, res) => {
  try {
    const payload = req.body;

    const result = await registerService.getDetailRegisterService(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(result) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getDetailMasterRegisterService = async (req, res) => {
  try {
    const payload = req.body;

    const result = await registerService.getDetailMasterRegisterService(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result.datas[0].datas[1].datas });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getScheduleAvailable = async (req, res) => {
  try {
    const payload = req.body;
    const result = await fttxExternal.getScheduleAvailable({
      office_id: payload.office_id,
    });

    let data = [];
    if (result.data['soap-env:body']) {
      if (result.data['soap-env:body']['ns1:getscheduleavailableresponse']) {
        if (result.data['soap-env:body']['ns1:getscheduleavailableresponse'].return) {
          if (result.data['soap-env:body']['ns1:getscheduleavailableresponse'].return.item) {
            data = result.data['soap-env:body']['ns1:getscheduleavailableresponse'].return.item;
          } else {
            return {};
          }
        } else {
          return {};
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
    return res.status(200).json({ status: 200, message: 'Succesfully', data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const dateInstallEstimate = async (req, res) => {
  try {
    const payload = req.body;
    const result = await fttxExternal.dateInstallEstimate({
      order_id: payload.order_id,
      date_time: payload.date_time,
    });

    const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
      value: payload.order_code,
    });
    const resultCheckOrderStatus2 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus);

    const transaction = await registerService.findTransactionRegisterService({ order_status_code: payload.order_code });

    let data = [];
    if (result.data['soap-env:body']) {
      if (result.data['soap-env:body']['ns1:dateinstallestimateresponse']) {
        if (result.data['soap-env:body']['ns1:dateinstallestimateresponse'].return) {
          if (result.data['soap-env:body']['ns1:dateinstallestimateresponse'].return.item) {
            data = result.data['soap-env:body']['ns1:dateinstallestimateresponse'].return.item;
            const valueInt = _.find(data, (o) => o.key === 'value_int');
            const valueText = _.find(data, (o) => o.key === 'value_text');

            if (valueInt.value === '1') {
              const d = new Date(payload.date_time);
              const monthNo = (d.getMonth());
              const hour = (`00${d.getHours()}`).slice(-2);
              const monthname = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
              let timeName = '';
              if (hour <= 12) {
                timeName = '(ช่วงเช้า)';
              } else {
                timeName = '(ช่วงบ่าย)';
              }

              const fullDate = `${d.getDate()} ${monthname[monthNo]} ${d.getFullYear() + 543} ${timeName}`;

              if (transaction) {
                await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
                  order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
                  order_status_code: resultCheckOrderStatus2.orderStatusCode,
                  order_status_sono: resultCheckOrderStatus2.orderStatusSono,
                  order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
                  order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
                  order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
                  order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
                  order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
                  order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
                  order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
                  order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
                  order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
                  order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
                  order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
                  order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
                  order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
                  order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
                  order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
                  date_install_estimate: payload.date_time,
                  date_install_estimate_value_int: valueInt.value,
                  date_install_estimate_value_text: valueText.value,
                  last_activity: 'date_install_estimate',
                  updated_at: new Date(),
                });
                const speed = resultCheckOrderStatus2.orderStatusSpeed;
                const speedArray = speed.split('/');
                const speed1 = Number(speedArray[0] / 1024);
                const speed2 = Number(speedArray[1] / 1024);
                const speedName = `${speed1}/${speed2}`;
                if (transaction.promotion_name === '') {
                  pushMessage(payload.line_user_id, [
                    {
                      type: 'text',
                      text: `ขอบคุณที่สมัครบริการ\nNT BROADBAND \n\nรายละเอียดการสมัคร\nเบอร์: ${resultCheckOrderStatus2.orderStatusCustomerMobile} \nแพ็กเกจ: ${resultCheckOrderStatus2.orderStatusPromotionName} \n${String(speedName)} Mbps\n\nวันนัดหมาย\n${fullDate} \n\nหมายเลขติดตามสถานะการติดตั้ง\n${resultCheckOrderStatus2.orderStatusCode} \n\nหมายเหตุ* อาจมีค่าเดินสายเพิ่มเติม\nภายหลังในวันติดตั้งหากระยะสาย\nไกลเกินกว่า 300 เมตร`,
                    },
                  ]);
                } else {
                  pushMessage(payload.line_user_id, [
                    {
                      type: 'text',
                      text: `ขอบคุณที่สมัครบริการ\nNT BROADBAND \n\nรายละเอียดการสมัคร\nเบอร์: ${transaction.customer_mobile} \nแพ็กเกจ: ${resultCheckOrderStatus2.orderStatusPromotionName} \n${String(speedName)} Mbps ${transaction.promotion_price} บาท \n\nวันนัดหมาย\n${fullDate} \n\nหมายเลขติดตามสถานะการติดตั้ง\n${resultCheckOrderStatus2.orderStatusCode} \n\nหมายเหตุ* อาจมีค่าเดินสายเพิ่มเติม\nภายหลังในวันติดตั้งหากระยะสาย\nไกลเกินกว่า 300 เมตร`,
                    },
                  ]);
                }
              } else {
                await registerService.createTransactionRegisterService({
                  line_user_id: payload.line_user_id,
                  type: 'register-service',
                  promotion: '',
                  instrument: '',
                  order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
                  order_status_code: resultCheckOrderStatus2.orderStatusCode,
                  order_status_sono: resultCheckOrderStatus2.orderStatusSono,
                  order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
                  order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
                  order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
                  order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
                  order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
                  order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
                  order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
                  order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
                  order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
                  order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
                  order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
                  order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
                  order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
                  order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
                  order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
                  date_install_estimate: payload.date_time,
                  date_install_estimate_value_int: valueInt.value,
                  date_install_estimate_value_text: valueText.value,
                  last_activity: 'date_install_estimate',
                  status: 'available',
                });
                pushMessage(payload.line_user_id, [
                  {
                    type: 'text',
                    text: `ขอบคุณที่สมัครบริการ\nNT BROADBAND \n\nรายละเอียดการสมัคร\nเบอร์: ${resultCheckOrderStatus2.orderStatusCustomerMobile} \n\nวันนัดหมาย\n${fullDate} \n\nหมายเลขติดตามสถานะการติดตั้ง\n${resultCheckOrderStatus2.orderStatusCode} \n\nหมายเหตุ* อาจมีค่าเดินสายเพิ่มเติม\nภายหลังในวันติดตั้งหากระยะสาย\nไกลเกินกว่า 300 เมตร`,
                  },
                ]);
              }
              return res.status(200).json({ status: 200, message: 'Succesfully', data });
            }
            pushMessage(payload.line_user_id, [
              {
                type: 'text',
                text: `${valueText.value}`,
              },
            ]);
            return res.status(400).json({ status: 400, message: valueText.value });
          }
        }
      }
    }
    return res.status(400).json({ status: 400, message: 'Error', data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const CMSRegisterServiceShow = async (req, res) => {
  try {
    const data = await registerService.findMasterRegisterService();

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const CMSRegisterServiceUpdate = async (req, res) => {
  try {
    const payload = req.body;
    payload.updated_at = new Date();
    await registerService.updateMasterRegisterService(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const paymentsOtc = async (req, res) => {
  try {
    const payload = req.body;

    const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
      value: payload.order_code,
    });

    const resultCheckOrderStatus2 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus);

    const vat = 7;
    const TxKey = '844db236cdca71ad49b8de720b6915fc6ae241766fdf88b666094f2a6e84452f';
    const orderStatusCostSetupVat7 = (resultCheckOrderStatus2.orderStatusCostSetup * vat) / 100;
    const orderStatusCostFeeVat7 = (resultCheckOrderStatus2.orderStatusCostFee * vat) / 100;
    const orderStatusCostMaintenanceVat7 = (resultCheckOrderStatus2.orderStatusCostMaintenance * vat) / 100;
    const orderStatusCostontVat7 = (resultCheckOrderStatus2.orderStatusCostont * vat) / 100;
    const orderStatusCostOverCableVat7 = (resultCheckOrderStatus2.orderStatusCostOverCable * vat) / 100;
    const total = Number(resultCheckOrderStatus2.orderStatusCostSetup) + Number(resultCheckOrderStatus2.orderStatusCostFee) + Number(resultCheckOrderStatus2.orderStatusCostMaintenance) + Number(resultCheckOrderStatus2.orderStatusCostont) + Number(resultCheckOrderStatus2.orderStatusCostOverCable);
    const totalVat = orderStatusCostSetupVat7 + orderStatusCostFeeVat7 + orderStatusCostMaintenanceVat7 + orderStatusCostontVat7 + orderStatusCostOverCableVat7;

    const orderItems = [];
    const orderRef = uuidv4();

    const transaction = await registerService.findTransactionRegisterService({ order_status_code: payload.order_code });

    if (transaction) {
      if (transaction.last_activity === 'payment-otc' && transaction.line_noti_payment_status === 'completed') {
        return res.status(400).json({ status: 400, message: 'You already have a line_noti_payment_status.' });
      }
      if (resultCheckOrderStatus2.orderStatusCostSetup) {
        orderItems.push({
          account_code: '50301000',
          product_code: 'D0306003',
          product_name: 'ค่าติดตั้ง',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostSetup).toFixed(2),
          vat: Number.parseFloat(orderStatusCostSetupVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostSetup).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostSetupVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostFee) {
        orderItems.push({
          account_code: '50300000',
          product_code: 'D0306096',
          product_name: 'ค่าธรรมเนียมแรกเข้า',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostFee).toFixed(2),
          vat: Number.parseFloat(orderStatusCostFeeVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostFee).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostFeeVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostMaintenance) {
        orderItems.push({
          account_code: '50301000',
          product_code: 'D0306003',
          product_name: 'ค่าบำรุงรักษารายเดือน',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostMaintenance).toFixed(2),
          vat: Number.parseFloat(orderStatusCostMaintenanceVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostMaintenance).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostMaintenanceVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostont) {
        orderItems.push({
          account_code: '55000000',
          product_code: 'D0306003',
          product_name: 'ค่าอุปกรณ์ ONU',
          model: transaction.promotion_service_name,
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostont).toFixed(2),
          vat: Number.parseFloat(orderStatusCostontVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostont).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostontVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostOverCable) {
        orderItems.push({
          account_code: '50300000',
          product_code: 'D0306096',
          product_name: 'ค่าทางสายเกิน',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostOverCable).toFixed(2),
          vat: Number.parseFloat(orderStatusCostOverCableVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostOverCable).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostOverCableVat7).toFixed(2),
        });
      }

      const payloadPayOtc = {
        'x-clientip': payload['x-clientip'],
        channel_product_code: process.env.E_SERVICE_PAY_OTC_REGISTER_CHANNEL_PRODUCT_CODE,
        channel_service_code: process.env.E_SERVICE_PAY_OTC_REGISTER_CHANNEL_SERVICE_CODE,
        order_ref: orderRef,
        order_sr: payload.order_code,
        order_items: orderItems,
        total_unit: orderItems.length,
        total_price: Number.parseFloat(total).toFixed(2),
        total_vat: Number.parseFloat(totalVat).toFixed(2),
        total_payment: Number.parseFloat(total + totalVat).toFixed(2),
        signature: md5(`${TxKey}|${orderRef}|${payload.order_code}|${orderItems.length}|${total}|${totalVat}|${total + totalVat}`),
        language: 'th',
        home_location: transaction.office_code,
        offer_id: transaction.promotion_offer_id,
        etax_invoice: {
          document_type_code: 'T03',
          tax_id_type: (transaction.type_identity === 'yes') ? 'NIDN' : 'CCPT',
          national_id: transaction.personal_id,
          business_id: '',
          branch_id: '',
          company_name: '',
          firstname: transaction.customer_first_name,
          lastname: transaction.customer_last_name,
          email: transaction.customer_email,
          mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
          village: '',
          house_no: transaction.customer_no,
          moo: '',
          soi: '',
          road: transaction.customer_road,
          subdistrict: transaction.customer_subdistrict,
          district: transaction.customer_district,
          province: transaction.customer_province,
          zipcode: transaction.customer_zip,
          office_name: '',
        },
      };

      const result = await eServiceExternal.payOtc(payloadPayOtc);

      if (result) {
        await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
          payment_otc_order_ref: orderRef,
          payment_otc_request_ex_no: result.data.responses.data.requestExNo,
          payment_otc_url: result.data.responses.data.url,
          last_activity: 'payment-otc',
          updated_at: new Date(),
        });

        return res.status(200).json({ status: 200, message: 'Succesfully', data: result.data });
      }
    } else {
      if (resultCheckOrderStatus2.orderStatusCostSetup) {
        orderItems.push({
          account_code: '50301000',
          product_code: 'D0306003',
          product_name: 'ค่าติดตั้ง',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostSetup).toFixed(2),
          vat: Number.parseFloat(orderStatusCostSetupVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostSetup).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostSetupVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostFee) {
        orderItems.push({
          account_code: '50300000',
          product_code: 'D0306096',
          product_name: 'ค่าธรรมเนียมแรกเข้า',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostFee).toFixed(2),
          vat: Number.parseFloat(orderStatusCostFeeVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostFee).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostFeeVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostMaintenance) {
        orderItems.push({
          account_code: '50301000',
          product_code: 'D0306003',
          product_name: 'ค่าบำรุงรักษารายเดือน',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostMaintenance).toFixed(2),
          vat: Number.parseFloat(orderStatusCostMaintenanceVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostMaintenance).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostMaintenanceVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostont) {
        orderItems.push({
          account_code: '55000000',
          product_code: 'D0306003',
          product_name: 'ค่าอุปกรณ์ ONU',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostont).toFixed(2),
          vat: Number.parseFloat(orderStatusCostontVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostont).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostontVat7).toFixed(2),
        });
      }

      if (resultCheckOrderStatus2.orderStatusCostOverCable) {
        orderItems.push({
          account_code: '50300000',
          product_code: 'D0306096',
          product_name: 'ค่าทางสายเกิน',
          model: '',
          unit: '1',
          price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostOverCable).toFixed(2),
          vat: Number.parseFloat(orderStatusCostOverCableVat7).toFixed(2),
          net_price: Number.parseFloat(resultCheckOrderStatus2.orderStatusCostOverCable).toFixed(2),
          net_vat: Number.parseFloat(orderStatusCostOverCableVat7).toFixed(2),
        });
      }

      const resultCreate = await registerService.createTransactionRegisterService({
        line_user_id: payload.line_user_id,
        type: 'register-service',
        promotion: '',
        instrument: '',
        order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
        order_status_code: resultCheckOrderStatus2.orderStatusCode,
        order_status_sono: resultCheckOrderStatus2.orderStatusSono,
        order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
        order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
        order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
        order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
        order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
        order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
        order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
        order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
        order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
        order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
        order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
        order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
        order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
        order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
        order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
        last_activity: 'payment-otc',
        status: 'available',
      });

      const payloadPayOtc = {
        'x-clientip': payload['x-clientip'],
        channel_product_code: process.env.E_SERVICE_PAY_OTC_REGISTER_CHANNEL_PRODUCT_CODE,
        channel_service_code: process.env.E_SERVICE_PAY_OTC_REGISTER_CHANNEL_SERVICE_CODE,
        order_ref: orderRef,
        order_sr: payload.order_code,
        order_items: orderItems,
        total_unit: orderItems.length,
        total_price: Number.parseFloat(total).toFixed(2),
        total_vat: Number.parseFloat(totalVat).toFixed(2),
        total_payment: Number.parseFloat(total + totalVat).toFixed(2),
        signature: md5(`${TxKey}|${orderRef}|${payload.order_code}|${orderItems.length}|${total}|${totalVat}|${total + totalVat}`),
        language: 'th',
        home_location: '',
        offer_id: '',
        etax_invoice: {
          document_type_code: 'T05',
          tax_id_type: 'OTHR',
          national_id: '',
          business_id: '',
          branch_id: '',
          company_name: '',
          firstname: '',
          lastname: '',
          email: '',
          mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
          village: '',
          house_no: '',
          moo: '',
          soi: '',
          road: '',
          subdistrict: '',
          district: '',
          province: '',
          zipcode: '',
          office_name: '',
        },
      };

      const result = await eServiceExternal.payOtc(payloadPayOtc);

      if (result) {
        await registerService.updateTransactionRegisterService({ _id: resultCreate._id }, {
          payment_otc_order_ref: orderRef,
          payment_otc_request_ex_no: result.data.responses.data.requestExNo,
          payment_otc_url: result.data.responses.data.url,
          last_activity: 'payment-otc',
          updated_at: new Date(),
        });

        return res.status(200).json({ status: 200, message: 'Succesfully', data: result.data });
      }
    }

    return res.status(400).json({ status: 400, message: 'error' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(status).json({ status, message: err.message, data });
  }
};

const checkOrderStatus = async (req, res) => {
  try {
    const payload = req.body;
    let orderId = '';
    let code = '';
    let sono = '';
    let statusId = '';
    let statusName = '';
    let isPaid = '';
    let promotionName = '';
    let packageName = '';
    let speed = '';
    let fullname = '';
    let filename = '';
    let officeId = '';
    let costSetup = '';
    let costFee = '';
    let costMaintenance = '';
    let costont = '';
    let costOverCable = '';
    let customerMobile = '';

    const payloadCheckOrderStatus = {
      value: payload.order_code,
    };
    const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus(payloadCheckOrderStatus);
    if (resultCheckOrderStatus.data) {
      if (resultCheckOrderStatus.data['soap-env:body']) {
        if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse']) {
          if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return) {
            const { item } = resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return;

            if (item instanceof Array) {
              const orderId1 = _.find(item, (o) => o.key === 'order_id');

              if (orderId1) {
                orderId = orderId1.value;
              }

              const code1 = _.find(item, (o) => o.key === 'code');

              if (code1) {
                code = code1.value;
              }

              const sono1 = _.find(item, (o) => o.key === 'sono');

              if (sono1) {
                sono = sono1.value;
              }

              const statusId1 = _.find(item, (o) => o.key === 'status_id');

              if (statusId1) {
                statusId = statusId1.value;
              }

              const statusName1 = _.find(item, (o) => o.key === 'status_name');

              if (statusName1) {
                statusName = statusName1.value;
              }

              const isPaid1 = _.find(item, (o) => o.key === 'is_paid');

              if (isPaid1) {
                isPaid = isPaid1.value;
              }

              const promotionName1 = _.find(item, (o) => o.key === 'promotion_name');

              if (promotionName1) {
                promotionName = promotionName1.value;
              }

              const packageName1 = _.find(item, (o) => o.key === 'package_name');

              if (packageName1) {
                packageName = packageName1.value;
              }

              const speed1 = _.find(item, (o) => o.key === 'speed');

              if (speed1) {
                speed = speed1.value;
              }

              const fullname1 = _.find(item, (o) => o.key === 'fullname');

              if (fullname1) {
                fullname = fullname1.value;
              }

              const filename1 = _.find(item, (o) => o.key === 'filename');

              if (filename1) {
                filename = filename1.value;
              }

              const officeid1 = _.find(item, (o) => o.key === 'office_id');

              if (officeid1) {
                officeId = officeid1.value;
              }

              const costsetup1 = _.find(item, (o) => o.key === 'cost_setup');

              if (costsetup1) {
                costSetup = costsetup1.value;
              }

              const costfee1 = _.find(item, (o) => o.key === 'cost_fee');

              if (costfee1) {
                costFee = costfee1.value;
              }

              const costmaintenance1 = _.find(item, (o) => o.key === 'cost_maintenance');

              if (costmaintenance1) {
                costMaintenance = costmaintenance1.value;
              }

              const costont1 = _.find(item, (o) => o.key === 'cost_ont');

              if (costont1) {
                costont = costont1.value;
              }

              const costovercable1 = _.find(item, (o) => o.key === 'cost_over_cable');

              if (costovercable1) {
                costOverCable = costovercable1.value;
              }

              const customermobile1 = _.find(item, (o) => o.key === 'customer_mobile');

              if (customermobile1) {
                customerMobile = customermobile1.value;
              }
            }
          }
        }
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'Succesfully',
      data: {
        orderId,
        code,
        sono,
        statusId,
        statusName,
        isPaid,
        promotionName,
        packageName,
        speed,
        fullname,
        filename,
        officeId,
        costSetup,
        costFee,
        costMaintenance,
        costont,
        costOverCable,
        customerMobile,
      },
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getSRList = async (req, res) => {
  try {
    const payload = req.body;

    const data = await registerService.getSRList(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const payload = req.body;
    const transaction = await registerService.findTransactionRegisterService({ order_status_code: payload.id });
    if (transaction) {
      const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
        value: transaction.order_code,
      });
      const resultCheckOrderStatus2 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus);
      await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
        order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
        order_status_code: resultCheckOrderStatus2.orderStatusCode,
        order_status_sono: resultCheckOrderStatus2.orderStatusSono,
        order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
        order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
        order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
        order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
        order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
        order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
        order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
        order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
        order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
        order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
        order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
        order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
        order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
        order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
        order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
        updated_at: new Date(),
      });
    } else {
      return res.status(400).json({ status: 400, message: 'Data not found.' });
    }
    return res.status(200).json({ status: 200, message: 'Success' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const updateAfterPayment = async (payload) => {
  try {
    const datenow = moment.tz(new Date(), 'Asia/Bangkok').format('DD/MM/YYYY');
    const transaction = await registerService.findTransactionRegisterService({ payment_otc_order_ref: payload.result.order_ref });
    if (transaction) {
      const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
        value: payload.result.sr,
      });

      const resultCheckOrderStatus2 = await registerService.extractresultCheckOrderStatus(resultCheckOrderStatus);
      await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
        order_status_order_id: resultCheckOrderStatus2.orderStatusOrderId,
        order_status_code: resultCheckOrderStatus2.orderStatusCode,
        order_status_sono: resultCheckOrderStatus2.orderStatusSono,
        order_status_status_id: resultCheckOrderStatus2.orderStatusStatusId,
        order_status_status_name: resultCheckOrderStatus2.orderStatusStatusName,
        order_status_is_paid: resultCheckOrderStatus2.orderStatusIsPaid,
        order_status_promotion_name: resultCheckOrderStatus2.orderStatusPromotionName,
        order_status_package_name: resultCheckOrderStatus2.orderStatusPackageName,
        order_status_speed: resultCheckOrderStatus2.orderStatusSpeed,
        order_status_fullname: resultCheckOrderStatus2.orderStatusFullname,
        order_status_filename: resultCheckOrderStatus2.orderStatusFilename,
        order_status_office_id: resultCheckOrderStatus2.orderStatusOfficeId,
        order_status_cost_setup: resultCheckOrderStatus2.orderStatusCostSetup,
        order_status_cost_fee: resultCheckOrderStatus2.orderStatusCostFee,
        order_status_cost_maintenance: resultCheckOrderStatus2.orderStatusCostMaintenance,
        order_status_cost_ont: resultCheckOrderStatus2.orderStatusCostont,
        order_status_cost_over_cable: resultCheckOrderStatus2.orderStatusCostOverCable,
        order_status_customer_mobile: resultCheckOrderStatus2.orderStatusCustomerMobile,
        line_noti_payment_status: payload.result.payment_status,
        line_noti_payment_method: payload.result.payment_method,
        line_noti_order_ref: payload.result.order_ref,
        line_noti_transaction_ref: payload.result.transaction_ref,
        line_noti_sr: payload.result.sr,
        line_noti_datetime: moment.tz(new Date(), 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
        updated_at: new Date(),
      });
      if (payload.result.payment_status === 'completed') {
        const total = Number(resultCheckOrderStatus2.orderStatusCostSetup) + Number(resultCheckOrderStatus2.orderStatusCostFee) + Number(resultCheckOrderStatus2.orderStatusCostMaintenance) + Number(resultCheckOrderStatus2.orderStatusCostont) + Number(resultCheckOrderStatus2.orderStatusCostOverCable);
        let paymentMethodName = '-';
        if (payload.result.payment_method === '2' || payload.result.payment_method === 2) {
          paymentMethodName = 'CreditCard';
        } else if (payload.result.payment_method === '3' || payload.result.payment_method === 3) {
          paymentMethodName = 'Cash';
        } else if (payload.result.payment_method === '4' || payload.result.payment_method === 4) {
          paymentMethodName = 'Cashier\'s Cheque';
        } else if (payload.result.payment_method === '5' || payload.result.payment_method === 5) {
          paymentMethodName = 'DebitCard';
        } else if (payload.result.payment_method === '6' || payload.result.payment_method === 6) {
          paymentMethodName = 'DirectDebit';
        }
        const vat = 7;
        pushMessage(transaction.line_user_id, [
          {
            type: 'text',
            text: `NT ขอบคุณสำหรับการชำระค่าติดตั้งอุปกรณ์ หมายเลข ${resultCheckOrderStatus2.orderStatusCode}`,
          },
          eServicePayment({
            transactionRef: payload.result.order_ref,
            paymentMethod: paymentMethodName,
            paymentDate: datenow,
            total: String(Number.parseFloat(total + ((total * vat) / 100)).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            orderCode: resultCheckOrderStatus2.orderStatusCode,
          }),
        ]);
      }
      if (resultCheckOrderStatus2.orderStatusStatusId === '3' || resultCheckOrderStatus2.orderStatusStatusId === '4' || resultCheckOrderStatus2.orderStatusStatusId === '21') {
        pushMessage(transaction.line_user_id, [
          {
            type: 'text',
            text: 'กรุณาเลือกวันนัดหมายติดตั้ง  NT BROADBAND',
          },
          registerServiceScheduleInstallationDate(resultCheckOrderStatus2.orderStatusCode),
        ]);
      }
    } else {
      return { status: 400, message: 'Data not found.' };
    }
    return { status: 200, message: 'Success' };
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

export default {
  registerForm,
  payForInstallation,
  scheduleInstallationDate,
  leadFrom,
  checkBlacklist,
  getDetailRegisterService,
  getDetailMasterRegisterService,
  getScheduleAvailable,
  dateInstallEstimate,
  CMSRegisterServiceShow,
  CMSRegisterServiceUpdate,
  paymentsOtc,
  checkOrderStatus,
  getSRList,
  updateOrderStatus,
  updateAfterPayment,
};
