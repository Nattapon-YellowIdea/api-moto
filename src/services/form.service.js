import captureException from '../utils/captureException.js';
import { Form3 } from '../models/db.model.js';

const submitForm3 = async (payload) => {
  try {
    const result = new Form3(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkSubmitted = async (payload) => {
  try {
    const result = Form3.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  submitForm3,
  checkSubmitted,
};
