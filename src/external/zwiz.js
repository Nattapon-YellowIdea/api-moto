import axios from 'axios';
import captureException from '../utils/captureException.js';
import externalLogActivityService from '../services/externalLogActivities.service.js';

const webhookForward = async (payload) => {
  try {
    // console.log(JSON.stringify(payload));
    const config = {
      method: 'post',
      url: `${process.env.ZWIZ_URL}/webhook`,
      headers: {
        Authorization: `Bearer ${process.env.ZWIZ_AUTHORIZATION}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    };

    const { status, data } = await axios(config);
    // console.log('status ', status);
    // console.log('data ', JSON.stringify(data));

    await externalLogActivityService.createTransactionExternalLogActivities({
      line_user_id: payload.data.lineOriginal.source.userId,
      service: 'zwizExternal',
      module: 'webhookForward',
      payload,
      status,
      response: data,
    });

    if (status === 200) {
      return { status, data };
    }

    return {};
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  // eslint-disable-next-line import/prefer-default-export
  webhookForward,
};
