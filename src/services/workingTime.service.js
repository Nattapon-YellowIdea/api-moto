import captureException from '../utils/captureException.js';
import { MasterWorkingTime } from '../models/nt.model.js';

const findMasterWorkingTime = async () => {
  try {
    const result = MasterWorkingTime.findOne({}).sort({ created_at: -1 });

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};

const updateMasterWorkingTime = async (payload) => {
  try {
    const isExist = await MasterWorkingTime.countDocuments({});

    if (isExist) {
      return MasterWorkingTime.findOneAndUpdate({ _id: payload.id }, payload);
    }

    const result = new MasterWorkingTime(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  findMasterWorkingTime,
  updateMasterWorkingTime,
};
