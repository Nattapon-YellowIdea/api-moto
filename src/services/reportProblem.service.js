import captureException from '../utils/captureException.js';
import {
  TransactionReportProblem,
} from '../models/nt.model.js';

const createTransactionReportProblem = async (payload) => {
  try {
    const result = new TransactionReportProblem(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateTransactionReportProblem = async (filter, payload) => {
  try {
    const result = TransactionReportProblem.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getListFeedback = async (payload) => {
  try {
    const result = TransactionReportProblem.find(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkTicketNotExists = async (payload) => {
  try {
    const result = TransactionReportProblem.exists(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const deleteTransactionReportProblem = async (payload) => {
  try {
    const result = TransactionReportProblem.deleteOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const findTransactionReportProblem = async (payload) => {
  try {
    const result = TransactionReportProblem.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  createTransactionReportProblem,
  updateTransactionReportProblem,
  getListFeedback,
  checkTicketNotExists,
  deleteTransactionReportProblem,
  findTransactionReportProblem,
};
