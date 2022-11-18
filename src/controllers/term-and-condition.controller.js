import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import { replaceID } from '../utils/helper.js';
import termAndConditionService from '../services/termAndCondition.service.js';

const CMSTOUCreate = async (req, res) => {
  try {
    const payload = req.body;
    const checkVersion = await termAndConditionService.findTermAndConditionService();
    if (checkVersion === null) {
      payload.version = 1;
    } else {
      payload.version = checkVersion.version + 1;
      payload.created_at = new Date();
      payload.updated_at = new Date();
    }

    const result = await termAndConditionService.createTermAndConditionService(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', response: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};
const CMSTOUShow = async (req, res) => {
  try {
    const data = await termAndConditionService.findTermAndConditionService();

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const termAndConditionShow = async (req, res) => {
  try {
    const data = await termAndConditionService.findTermAndConditionService();

    return res.status(200).json({ status: 200, message: 'Succesfully', data: replaceID(data) });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const termAndConditionUpdate = async (req, res) => {
  try {
    const payload = req.body;
    payload.updated_at = new Date();
    await termAndConditionService.updateConsentToUserprofile({ line_user_id: payload.line_user_id }, { is_consent: payload.is_consent, consent_version: payload.consent_version });
    await termAndConditionService.createTransactionLogConsent(payload);
    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};
export default {
  CMSTOUCreate,
  CMSTOUShow,
  termAndConditionUpdate,
  termAndConditionShow,
};
