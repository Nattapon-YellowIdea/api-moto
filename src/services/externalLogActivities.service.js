import captureException from '../utils/captureException.js';
import { TransactionExternalLogActivities } from '../models/externalLogActivities.model.js';

const createTransactionExternalLogActivities = async (payload) => {
  try {
    const result = new TransactionExternalLogActivities(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createTransactionExternalLogActivities,
};
