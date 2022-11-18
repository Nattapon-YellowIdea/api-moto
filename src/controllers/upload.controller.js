import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import upload from '../utils/upload.js';

const uploadImage = async (req, res) => {
  try {
    const payload = req.body;
    const result = await upload(payload.base64, payload.filename);
    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  uploadImage,
};
