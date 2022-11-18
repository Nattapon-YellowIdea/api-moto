import captureException from '../utils/captureException.js';
import { MasterTopup, TransactionTopup } from '../models/nt.model.js';

const findMasterTopupService = async () => {
  try {
    const result = MasterTopup.findOne({}).sort({ created_at: -1 });

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};
const showMasterTopupService = async (payload) => {
  try {
    const result = MasterTopup.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createMasterTopupService = async (payload) => {
  try {
    const result = new MasterTopup(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateMasterTopupService = async (filter, payload) => {
  try {
    const result = MasterTopup.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const deleteMasterTopupService = async (filter) => {
  try {
    const result = MasterTopup.findByIdAndDelete(filter);

    return result;
  } catch (err) {
    captureException(filter);
    throw err;
  }
};
const listMasterTopupService = async (payload) => {
  try {
    let sort = 'created_at';
    let order = -1;
    if (payload.sort !== '') {
      sort = payload.sort;
    }
    if (payload.order !== '') {
      if (payload.order === 'desc') {
        order = -1;
      } else {
        order = 1;
      }
    }
    const result = MasterTopup.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const listTotalMasterTopupService = async (payload) => {
  try {
    const total = MasterTopup.count(payload.filte);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const createTransactionTopup = async (payload) => {
  try {
    const result = new TransactionTopup(payload);
    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const updateTransactionTopup = async (filter, payload) => {
  try {
    const result = TransactionTopup.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
const listTopupPrice = async (payload) => {
  try {
    const result = MasterTopup.find();
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const findTransactionTopup = async (payload) => {
  try {
    const result = TransactionTopup.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getDetailTransactionTopup = async (payload) => {
  try {
    const result = await TransactionTopup.findOne({ _id: payload.transaction_id });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  findMasterTopupService,
  showMasterTopupService,
  createMasterTopupService,
  updateMasterTopupService,
  listMasterTopupService,
  deleteMasterTopupService,
  listTotalMasterTopupService,
  createTransactionTopup,
  listTopupPrice,
  findTransactionTopup,
  updateTransactionTopup,
  getDetailTransactionTopup,
};
