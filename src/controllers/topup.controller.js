import moment from 'moment-timezone';
import md5 from 'md5';
import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import { replaceID } from '../utils/helper.js';
import topupService from '../services/topup.service.js';
import opmExternal from '../external/opm.js';
import eServiceExternal from '../external/eService.js';
import { pushMessage } from '../utils/line.js';
import topupPayment from '../constant/nt/messages/topup-payment.js';
import topupOpmNoti from '../constant/nt/messages/topup-opm-noti.js';
import cmsExternal from '../external/cms.js';
import { doubleBase64Decrypt } from '../utils/base64encrypt.js';
import mongoose from 'mongoose';

const CmsMasterTopupShow = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await topupService.showMasterTopupService({ _id: id });

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
const CmsMasterTopupList = async (req, res) => {
  try {
    const payload = req.body;
    const list = await topupService.listMasterTopupService(payload);
    const count = await topupService.listTotalMasterTopupService(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
const CmsMasterTopupCreate = async (req, res) => {
  try {
    const payload = req.body;
    const data = await topupService.createMasterTopupService(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
const CmsMasterTopupUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    payload.updated_at = new Date();
    const data = await topupService.updateMasterTopupService({ _id: id }, payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
const CmsMasterTopupDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await topupService.deleteMasterTopupService({ _id: id });

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const TopupVerify = async (req, res) => {
  try {
    const payload = req.body;
    const data = await topupService.createTransactionTopup(payload);
    const payloadTopupVerify = {
      request: 'verify',
      user: '',
      password: '',
      tranID: data._id,
      tranDate: moment.tz(new Date(data.created_at), 'Asia/Bangkok').format('YYYY-MM-DDTHH:mm:ss'),
      channel: 'LINE',
      account: '1113060335',
      amount: payload.amount,
      reference1: payload.mobile,
      reference2: '',
      reference3: '',
      branchCode: '0111',
      terminalID: '2',
    };

    const result = await opmExternal.verify(payloadTopupVerify);
    if (result.data) {
      await topupService.updateTransactionTopup({ _id: data._id }, {
        verify_response: result.data.response,
        verify_rescode: result.data.resCode,
        verify_res_mesg: result.data.resMesg,
        verify_tran_id: result.data.tranID,
        verify_reference2: result.data.reference2,
        verify_payment_id: result.data.paymentID,
        updated_at: new Date(),
      });
    }

    if (result.data.resCode === '0000') {
      return res.status(200).json({ status: 200, message: 'Succesfully', data: { id: data._id } });
    }
    return res.status(400).json({ status: 400, message: 'Error', data: result });
  } catch (err) {
    logger.error(err);
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

const TopupGetAddress = async (req, res) => {
  try {
    const payload = req.body;
    const transaction = await topupService.findTransactionTopup({ _id: payload.transaction_id });

    const payloadTopupGetAddress = {
      mobile: transaction.mobile,
    };

    const result = await opmExternal.getAddress(payloadTopupGetAddress);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
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

const TopupGetPriceList = async (req, res) => {
  try {
    const result = await topupService.listTopupPrice();

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
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

const TopupPay = async (req, res) => {
  try {
    const payload = req.body;
    const transaction = await topupService.findTransactionTopup({ _id: payload.transaction_id });
    const payloadTopupGetAddress = {
      mobile: transaction.mobile,
    };

    const resultTopupGetAddress = await opmExternal.getAddress(payloadTopupGetAddress);
    const TxKey = '844db236cdca71ad49b8de720b6915fc6ae241766fdf88b666094f2a6e84452f';
    const price = ((transaction.amount * 100) / 107);
    const amountVat7 = transaction.amount - ((transaction.amount * 100) / 107);
    const total = Number(price);
    const totalVat = Number(amountVat7);

    const orderItems = [];
    if (transaction.amount) {
      orderItems.push({
        account_code: '35310000',
        product_code: '99999324',
        product_name: 'เติมเงิน',
        model: '',
        unit: '1',
        price: Number.parseFloat(price).toFixed(2),
        vat: Number.parseFloat(amountVat7).toFixed(2),
        net_price: Number.parseFloat(price).toFixed(2),
        net_vat: Number.parseFloat(amountVat7).toFixed(2),
      });
    }
    // {"status":200,"message":"Succesfully","data":{"status":200,"data":{"IsSuccess":true,"Message":"","citizenID":null,"firstname":null,"lastname":null,"email":null,"contact_phone":null,"house_no":null,"village":null,"village_no":null,"soi":null,"road":null,"subdistrict":null,"district":null,"province":null,"zipcode":null}}}

    if (resultTopupGetAddress.data.citizenID !== '' && resultTopupGetAddress.data.citizenID !== null && resultTopupGetAddress.data.firstname !== '' && resultTopupGetAddress.data.firstname !== null && resultTopupGetAddress.data.lastname !== '' && resultTopupGetAddress.data.lastname !== null && resultTopupGetAddress.data.contact_phone !== '' && resultTopupGetAddress.data.contact_phone !== null && resultTopupGetAddress.data.house_no !== '' && resultTopupGetAddress.data.house_no !== null && resultTopupGetAddress.data.subdistrict !== '' && resultTopupGetAddress.data.subdistrict !== null && resultTopupGetAddress.data.district !== '' && resultTopupGetAddress.data.district !== null && resultTopupGetAddress.data.province !== '' && resultTopupGetAddress.data.province !== null && resultTopupGetAddress.data.zipcode !== '' && resultTopupGetAddress.data.zipcode !== null) {
      const payloadPayOtc = {
        'x-clientip': payload['x-clientip'],
        channel_product_code: process.env.E_SERVICE_PAY_OTC_TOPUP_PAY_CHANNEL_PRODUCT_CODE,
        channel_service_code: process.env.E_SERVICE_PAY_OTC_TOPUP_PAY_CHANNEL_SERVICE_CODE,
        order_ref: transaction._id,
        order_sr: '',
        order_items: orderItems,
        total_unit: orderItems.length,
        total_price: Number.parseFloat(price).toFixed(2),
        total_vat: Number.parseFloat(amountVat7).toFixed(2),
        total_payment: Number.parseFloat(price + amountVat7).toFixed(2),
        signature: md5(`${TxKey}|${transaction._id}|${orderItems.length}|${total}|${totalVat}|${total + totalVat}`),
        language: 'th',
        home_location: '',
        offer_id: '',
        etax_invoice: {
          document_type_code: 'T03',
          tax_id_type: 'NIDN',
          national_id: resultTopupGetAddress.data.citizenID,
          business_id: '',
          branch_id: '',
          company_name: '',
          firstname: resultTopupGetAddress.data.firstname,
          lastname: resultTopupGetAddress.data.lastname,
          email: resultTopupGetAddress.data.email,
          mobile: transaction.mobile,
          village: resultTopupGetAddress.data.village,
          house_no: resultTopupGetAddress.data.house_no,
          moo: resultTopupGetAddress.data.village_no,
          soi: resultTopupGetAddress.data.soi,
          road: resultTopupGetAddress.data.road,
          subdistrict: resultTopupGetAddress.data.subdistrict,
          district: resultTopupGetAddress.data.district,
          province: resultTopupGetAddress.data.province,
          zipcode: resultTopupGetAddress.data.zipcode,
          office_name: '',
        },
      };

      const result = await eServiceExternal.payOtc(payloadPayOtc);
      await topupService.updateTransactionTopup({ _id: payload.transaction_id }, {
        payment_otc_request_ex_no: result.data.responses.data.requestExNo,
        payment_otc_url: result.data.responses.data.url,
        updated_at: new Date(),
      });
      // Store Data To tagging method
      await cmsExternal.dataPillar([
        {
          line_user_id: transaction.line_user_id,
          line_display_name: '',
          line_display_image: '',
          data_pillar: 'Top up',
          definition: 'Phone number',
          data_point: transaction.mobile,
        },
      ]);

      return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
    }
    const payloadPayOtc = {
      'x-clientip': payload['x-clientip'],
      channel_product_code: process.env.E_SERVICE_PAY_OTC_TOPUP_PAY_CHANNEL_PRODUCT_CODE,
      channel_service_code: process.env.E_SERVICE_PAY_OTC_TOPUP_PAY_CHANNEL_SERVICE_CODE,
      order_ref: transaction._id,
      order_sr: '',
      order_items: orderItems,
      total_unit: orderItems.length,
      total_price: Number.parseFloat(price).toFixed(2),
      total_vat: Number.parseFloat(amountVat7).toFixed(2),
      total_payment: Number.parseFloat(price + amountVat7).toFixed(2),
      signature: md5(`${TxKey}|${transaction._id}|${orderItems.length}|${total}|${totalVat}|${total + totalVat}`),
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
        mobile: transaction.mobile,
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
    await topupService.updateTransactionTopup({ _id: payload.transaction_id }, {
      payment_otc_request_ex_no: result.data.responses.data.requestExNo,
      payment_otc_url: result.data.responses.data.url,
      updated_at: new Date(),
    });
    // Store Data To tagging method
    await cmsExternal.dataPillar([
      {
        line_user_id: transaction.line_user_id,
        line_display_name: '',
        line_display_image: '',
        data_pillar: 'Top up',
        definition: 'Phone number',
        data_point: transaction.mobile,
      },
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
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

const TopupGetDetail = async (req, res) => {
  try {
    const payload = req.body;

    if (!mongoose.Types.ObjectId.isValid(payload.transaction_id)) {
      payload.transaction_id = doubleBase64Decrypt(payload.transaction_id);
    }

    const result = await topupService.getDetailTransactionTopup(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(result) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const updateAfterPayment = async (payload) => {
  try {
    const datenow = moment.tz(new Date(), 'Asia/Bangkok').format('DD/MM/YYYY');
    const transaction = await topupService.findTransactionTopup({ _id: payload.result.order_ref });
    if (transaction) {
      await topupService.updateTransactionTopup({ _id: transaction._id }, {
        line_noti_payment_status: payload.result.payment_status,
        line_noti_payment_method: payload.result.payment_method,
        line_noti_order_ref: payload.result.order_ref,
        line_noti_transaction_ref: payload.result.transaction_ref,
        line_noti_invoiceno: payload.result.invoiceno,
        line_noti_datetime: moment.tz(new Date(), 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
        updated_at: new Date(),
      });
      if (payload.result.payment_status === 'completed') {
        const total = Number(transaction.amount);

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
        pushMessage(transaction.line_user_id, [
          {
            type: 'text',
            text: `NT ขอบคุณสำหรับการเติมเงิน หมายเลขบริการ ${transaction.mobile}`,
          },
          topupPayment({
            order_ref: payload.result.order_ref,
            transactionRef: payload.result.transaction_ref,
            paymentMethod: paymentMethodName,
            invoiceno: payload.result.invoiceno,
            mobile: transaction.mobile,
            paymentDate: datenow,
            total: String(Number.parseFloat(total).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          }),
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

const updateOpmNoti = async (payload) => {
  try {
    // const datenow = moment.tz(new Date(), 'Asia/Bangkok').format('DD/MM/YYYY');
    const transaction = await topupService.findTransactionTopup({ _id: payload.trans_id });
    if (transaction) {
      await topupService.updateTransactionTopup({ _id: transaction._id }, {
        opm_noti_status: payload.status,
        opm_noti_trans_id: payload.trans_id,
        opm_noti_phone_number: payload.phone_number,
        opm_noti_amount: payload.amount,
        opm_noti_datetime: moment.tz(new Date(), 'Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
        updated_at: new Date(),
      });

      if (payload.status === 'fail') {
        pushMessage(transaction.line_user_id, [
          {
            type: 'text',
            text: `ท่านได้เติมเงินจำนวน ${String(Number.parseFloat(payload.amount).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท สำหรับหมายเลข ${payload.phone_number} ไม่สำเร็จ`,
          },
        ]);
      } else {
        pushMessage(transaction.line_user_id, [
          {
            type: 'text',
            text: `ท่านได้เติมเงินจำนวน ${String(Number.parseFloat(payload.amount).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท สำหรับหมายเลข ${payload.phone_number} สำเร็จแล้ว`,
          },
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
  CmsMasterTopupShow,
  CmsMasterTopupList,
  CmsMasterTopupCreate,
  CmsMasterTopupUpdate,
  CmsMasterTopupDelete,
  TopupVerify,
  TopupGetAddress,
  TopupGetPriceList,
  TopupPay,
  TopupGetDetail,
  updateAfterPayment,
  updateOpmNoti,
};
