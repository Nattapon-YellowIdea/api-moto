import captureException from '../utils/captureException.js';
import {
  MasterRegister, TransactionBA, TransactionLogConsent, TransactionRegisterService, TransactionReportProblem, TransactionTopup,
} from '../models/nt.model.js';
import { MasterLineUser } from '../models/line.model.js';

const listMasterRegister = async (payload) => {
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

    const result = MasterRegister.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalMasterRegister = async (payload) => {
  try {
    const total = MasterRegister.count(payload.filter);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTransactionLogConsents = async (payload) => {
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

    const result = TransactionLogConsent.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalTransactionLogConsents = async (payload) => {
  try {
    const total = TransactionLogConsent.count(payload.filter);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTransactionRegisterService = async (payload) => {
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

    const result = TransactionRegisterService.find({
      ...payload.filter,
      order_status_code: { $ne: '' },
    }).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalTransactionRegisterService = async (payload) => {
  try {
    const total = TransactionRegisterService.count({
      ...payload.filter,
      order_status_code: { $ne: '' },
    });
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTransactionReportProblem = async (payload) => {
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

    const result = TransactionReportProblem.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalTransactionReportProblem = async (payload) => {
  try {
    const total = TransactionReportProblem.count(payload.filter);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTransactionBA = async (payload) => {
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

    const result = TransactionBA.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalTransactionBA = async (payload) => {
  try {
    const total = TransactionBA.count(payload.filter);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTransactionTopup = async (payload) => {
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

    const result = TransactionTopup.find(payload.filter).sort({ [sort]: order }).limit(payload.limit).skip(payload.offset);
    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const listTotalTransactionTopup = async (payload) => {
  try {
    const total = TransactionTopup.count(payload.filter);
    return total;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  listMasterRegister,
  listTotalMasterRegister,
  listTransactionLogConsents,
  listTotalTransactionLogConsents,
  listTransactionRegisterService,
  listTotalTransactionRegisterService,
  listTransactionReportProblem,
  listTotalTransactionReportProblem,
  listTransactionBA,
  listTotalTransactionBA,
  listTransactionTopup,
  listTotalTransactionTopup,
};
