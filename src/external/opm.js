import https from 'https';
import axios from 'axios';
import captureException from '../utils/captureException.js';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const verify = async (payload) => {
  try {
    const body = JSON.stringify({
      request: payload.request,
      user: payload.user,
      password: payload.password,
      tranID: payload.tranID,
      tranDate: payload.tranDate,
      channel: payload.channel,
      account: payload.account,
      amount: payload.amount,
      reference1: payload.reference1,
      reference2: payload.reference2,
      reference3: payload.reference3,
      branchCode: payload.branchCode,
      terminalID: payload.terminalID,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.OPM_URL}/EXCHANGE`,
      headers: {
        CCTR_NO: 'LINE',
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

const getAddress = async (payload) => {
  try {
    const body = JSON.stringify({
      phone_number: payload.mobile,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.OPM_URL}/2SHOT_GETADDRESS`,
      headers: {
        CCTR_NO: 'LINE',
        Accept: 'application/json',
        'Content-Type': 'application/json',
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

export default {
  verify,
  getAddress,
};
