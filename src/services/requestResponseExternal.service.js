import captureException from '../utils/captureException.js';
import { TransactionRequestResponseExternal } from '../models/nt.model.js';

const createTransactionRequestResponseExternal = async (payload) => {
  try {
    const result = new TransactionRequestResponseExternal(payload);
    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createTransactionRequestResponseExternal,
};
