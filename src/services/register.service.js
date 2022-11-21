import captureException from '../utils/captureException.js';
import { UserProfile } from '../models/db.model.js';

const createMasterRegister = async (payload) => {
  try {
    const result = new UserProfile(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkRegister = async (payload) => {
  try {
    const result = UserProfile.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createMasterRegister,
  checkRegister,
};
