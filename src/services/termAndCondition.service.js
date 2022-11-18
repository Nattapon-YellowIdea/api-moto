import captureException from '../utils/captureException.js';
import { MasterTermAndCondition, MasterRegister, TransactionLogConsent } from '../models/nt.model.js';

const findTermAndConditionService = async () => {
  try {
    const result = await MasterTermAndCondition.findOne({}).sort({ version: -1 });

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};

const createTermAndConditionService = async (payload) => {
  try {
    const result = new MasterTermAndCondition(payload);
    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateTermAndConditionService = async (filter, payload) => {
  try {
    const result = MasterTermAndCondition.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createTransactionLogConsent = async (payload) => {
  try {
    const result = new TransactionLogConsent(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateConsentToUserprofile = async (filter, payload) => {
  try {
    const result = MasterRegister.findOneAndUpdate(filter, payload, { upsert: true });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
export default {
  findTermAndConditionService,
  createTermAndConditionService,
  updateTermAndConditionService,
  createTransactionLogConsent,
  updateConsentToUserprofile,
};
