import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import registerService from '../services/register.service.js';

const registerForm = async (req, res) => {
  try {
    const payload = req.body;

    const result = await registerService.createMasterRegister(payload);

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

const checkRegister = async (req, res) => {
  try {
    const payload = req.body;

    const result = await registerService.checkRegister(payload);

    if (!result) {
      return res.status(200).json({ status: 200, message: 'Succesfully', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  registerForm,
  checkRegister,
};
