import captureException from '../utils/captureException.js';
import { TransactionLineNotifies, TransactionHistoryFileLineNotifies } from '../models/nt.model.js';

const createTransactionLineNotifies = async (payload) => {
  try {
    const result = new TransactionLineNotifies(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const findTransactionHistoryFileLineNotifies = async (payload) => {
  try {
    const result = TransactionHistoryFileLineNotifies.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createTransactionHistoryFileLineNotifies = async (payload) => {
  try {
    const result = new TransactionHistoryFileLineNotifies(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createManyTransactionLineNotifies = async (payload) => {
  try {
    const result = TransactionLineNotifies.insertMany(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getTransactionLineNotifiesBeforeDue = async () => {
  try {
    const result = await TransactionLineNotifies.find({ flag: '0', type: 'before_due' }).limit(1000);

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};

const getTransactionLineNotifiesAfterDue = async () => {
  try {
    const result = await TransactionLineNotifies.find({ flag: '0', type: 'after_due' }).limit(1000);

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};

const updateTransactionLineNotifies = async (filter, payload) => {
  try {
    const result = TransactionLineNotifies.updateMany(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createTransactionLineNotifies,
  createManyTransactionLineNotifies,
  findTransactionHistoryFileLineNotifies,
  createTransactionHistoryFileLineNotifies,
  getTransactionLineNotifiesBeforeDue,
  getTransactionLineNotifiesAfterDue,
  updateTransactionLineNotifies,
};
