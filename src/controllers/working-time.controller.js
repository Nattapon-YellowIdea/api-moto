import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import workingTime from '../services/workingTime.service.js';
import { replaceID } from '../utils/helper.js';

const CMSWorkingTimeShow = async (req, res) => {
  try {
    const data = await workingTime.findMasterWorkingTime();

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const CMSWorkingTimeUpdate = async (req, res) => {
  try {
    const payload = req.body;
    payload.updated_at = new Date();
    await workingTime.updateMasterWorkingTime(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const checkWorkingTime = async () => {
  try {
    const data = await workingTime.findMasterWorkingTime();

    const dateTime = new Date(new Date().setHours(new Date().getHours() + 7));
    let dayOfWeek = dateTime.getDay();
    dayOfWeek += 1;
    const startTime = `${data.days[dayOfWeek].work_periods[0].start_time}:00`;
    const endTime = `${data.days[dayOfWeek].work_periods[0].end_time}:00`;
    const currentDate = new Date(new Date().setHours(new Date().getHours() + 7));
    const startDate = new Date(currentDate.getTime());
    startDate.setHours(Number(startTime.split(':')[0]));
    startDate.setMinutes(Number(startTime.split(':')[1]));
    startDate.setSeconds(Number(startTime.split(':')[2]));
    const endDate = new Date(currentDate.getTime());
    endDate.setHours(Number(endTime.split(':')[0]));
    endDate.setMinutes(Number(endTime.split(':')[1]));
    endDate.setSeconds(Number(endTime.split(':')[2]));
    const isInTime = startDate < currentDate && endDate > currentDate;

    return isInTime;
  } catch (err) {
    return false;
  }
};

export default {
  CMSWorkingTimeShow,
  CMSWorkingTimeUpdate,
  checkWorkingTime,
};
