import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import formService from '../services/form.service.js';

const submitForm3 = async (req, res) => {
  try {
    const payload = req.body;

    const result = await formService.submitForm3(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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

    return res.status(400).json({ status, message: err.message, data });
  }
};

export default {
  submitForm3,
};
