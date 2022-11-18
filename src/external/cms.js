import axios from 'axios';
import captureException from '../utils/captureException.js';

const dataPillar = async (payload) => {
  try {
    const body = JSON.stringify(payload);

    const url = `${process.env.END_POINT_APP_V4}/api/app/segment-tagging-tx/new/multi`;
    const config = {
      method: 'post',
      url,
      headers: {
        'x-company': process.env.COMPANY_ID,
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
  dataPillar,
};
