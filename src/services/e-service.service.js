import axios from 'axios';
import qs from 'querystring';
import captureException from '../utils/captureException.js';
import {
  TransactionLogConsent, MasterRegister, TransactionLogin, TransactionPayBill, TransactionBA, MasterLineUser, TransactionVerifyOtp,
} from '../models/nt.model.js';

const createTransactionLogConsent = async (payload) => {
  try {
    const result = new TransactionLogConsent(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const showMasterRegister = async (payload) => {
  try {
    const result = MasterRegister.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const listMasterRegister = async (payload) => {
  try {
    const result = MasterRegister.find(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createMasterRegister = async (payload) => {
  try {
    const result = new MasterRegister(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateMasterRegister = async (filter, payload) => {
  try {
    const result = MasterRegister.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const deleteMasterRegister = async (payload) => {
  try {
    const result = MasterRegister.deleteOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createTransactionLogin = async (payload) => {
  try {
    const result = new TransactionLogin(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const checkRegister = async (payload) => {
  try {
    const result = MasterRegister.findOne(payload, 'line_user_id tier socialtype socialid displayname is_activate serviceAccess mobile email type is_consent consent_version idnumber idnumbertype');

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const checkFollow = async (payload) => {
  try {
    const result = MasterLineUser.findOne(payload, 'line_user_id line_display_name line_display_img is_follow');

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const getUserData = async (payload) => {
  try {
    const result = await MasterRegister.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const getTransactionLogin = async (payload) => {
  try {
    const result = await TransactionLogin.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateNewToken = async (user, payload) => {
  try {
    const result = await MasterRegister.updateOne(user, payload, { upsert: true });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateTransactionLogin = async (user, payload) => {
  try {
    const result = await TransactionLogin.updateOne(user, payload, { upsert: true });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const deleteTransactionLogin = async (payload) => {
  try {
    const result = await TransactionLogin.deleteOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createTransactionPayBill = async (payload) => {
  try {
    const result = new TransactionPayBill(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const getTransactionPayBill = async (payload) => {
  try {
    const result = await TransactionPayBill.findById(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateTransactionPayBill = async (filter, payload) => {
  try {
    const result = await TransactionPayBill.updateOne(filter, payload, { upsert: true });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const getOTPRefCode = async (payload) => {
  try {
    const result = await MasterRegister.findOne({ line_user_id: payload.line_user_id }, 'ref_code');

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createTransactionBA = async (payload) => {
  try {
    const result = new TransactionBA(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const requestOTP = async (payload) => {
  try {
    const body = qs.stringify({
      user: `${process.env.OTP_REQUEST_USER}`,
      password: `${process.env.OTP_REQUEST_PASS}`,
      phonenumber: payload.phoneNumber,
      sender: 'NT eService',
      text: `รหัส OTP ของคุณคือ ${payload.otpNumber} (Ref. Code: ${payload.ref_code})`,
    });

    const config = {
      method: 'post',
      url: `${process.env.OTP_REQUEST_ENDPOINT}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const checkeTransactionRefExists = async (payload) => {
  try {
    const result = await TransactionPayBill.exists(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createTransactionVerifyOtp = async (payload) => {
  try {
    const result = new TransactionVerifyOtp(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateTransactionVerifyOtp = async (filter, payload) => {
  try {
    const result = await TransactionVerifyOtp.findOneAndUpdate(filter, payload, { upsert: true, new: true });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getTransactionVerifyOtp = async (payload) => {
  try {
    const result = await TransactionVerifyOtp.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkTransactionVerifyOtp = async (payload) => {
  try {
    const result = await TransactionVerifyOtp.exists(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createTransactionLogConsent,
  showMasterRegister,
  createMasterRegister,
  updateMasterRegister,
  deleteMasterRegister,
  listMasterRegister,
  createTransactionLogin,
  checkRegister,
  getUserData,
  getTransactionLogin,
  updateNewToken,
  updateTransactionLogin,
  deleteTransactionLogin,
  createTransactionPayBill,
  updateTransactionPayBill,
  getTransactionPayBill,
  getOTPRefCode,
  requestOTP,
  checkeTransactionRefExists,
  createTransactionBA,
  checkFollow,
  createTransactionVerifyOtp,
  updateTransactionVerifyOtp,
  getTransactionVerifyOtp,
  checkTransactionVerifyOtp,
};
