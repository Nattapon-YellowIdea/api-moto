import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import { isNotNullAndNotEmpty, replaceID } from '../utils/helper.js';
import reportService from '../services/report.service.js';
import { doubleBase64Encrypt } from '../utils/base64encrypt.js';

const ReportMasterRegister = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);
    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);
    const checkEmail = isNotNullAndNotEmpty(payload.filter.email);
    const checkMobile = isNotNullAndNotEmpty(payload.filter.mobile);

    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkEmail) filter.email = { $regex: `.*${doubleBase64Encrypt(payload.filter.email)}.*` };
    if (checkMobile) filter.mobile = { $regex: `.*${doubleBase64Encrypt(payload.filter.mobile)}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listMasterRegister(payload);
    const count = await reportService.listTotalMasterRegister(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const ReportTransactionLogConsents = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);
    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);
    const checkEmail = isNotNullAndNotEmpty(payload.filter.email);
    const checkMobile = isNotNullAndNotEmpty(payload.filter.mobile);

    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkEmail) filter.email = { $regex: `.*${doubleBase64Encrypt(payload.filter.email)}.*` };
    if (checkMobile) filter.mobile = { $regex: `.*${doubleBase64Encrypt(payload.filter.mobile)}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listTransactionLogConsents(payload);
    const count = await reportService.listTotalTransactionLogConsents(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const ReportTransactionRegisterService = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);

    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);
    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listTransactionRegisterService(payload);
    const count = await reportService.listTotalTransactionRegisterService(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const ReportReportProblem = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);
    const checkEmail = isNotNullAndNotEmpty(payload.filter.email);
    const checkMobile = isNotNullAndNotEmpty(payload.filter.mobile);
    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);

    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkEmail) filter.customer_email = { $regex: `.*${payload.filter.email}.*` };
    if (checkMobile) filter.customer_mobile = { $regex: `.*${payload.filter.mobile}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listTransactionReportProblem(payload);
    const count = await reportService.listTotalTransactionReportProblem(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const ReportTransactionBA = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);
    const checkEmail = isNotNullAndNotEmpty(payload.filter.email);
    const checkMobile = isNotNullAndNotEmpty(payload.filter.mobile);
    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);
    const checkServiceNo = isNotNullAndNotEmpty(payload.filter.service_no);

    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkEmail) filter.customer_email = { $regex: `.*${payload.filter.email}.*` };
    if (checkMobile) filter.customer_mobile = { $regex: `.*${payload.filter.mobile}.*` };
    if (checkServiceNo) filter.serviceno = { $regex: `.*${payload.filter.service_no}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listTransactionBA(payload);
    const count = await reportService.listTotalTransactionBA(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const ReportTransactionTopup = async (req, res) => {
  try {
    const payload = req.body;
    const filter = {};

    const checkStartDate = isNotNullAndNotEmpty(payload.filter.start_date);
    const checkEndDate = isNotNullAndNotEmpty(payload.filter.end_date);
    const checkLineMid = isNotNullAndNotEmpty(payload.filter.line_user_id);
    const checkMobile = isNotNullAndNotEmpty(payload.filter.mobile);

    if (checkLineMid) filter.line_user_id = { $regex: `.*${payload.filter.line_user_id}.*` };
    if (checkMobile) filter.mobile = { $regex: `.*${payload.filter.mobile}.*` };
    if (checkStartDate && checkEndDate) {
      filter.created_at = {
        $gte: payload.filter.start_date,
        $lte: payload.filter.end_date,
      };
    }

    payload.filter = filter;

    const list = await reportService.listTransactionTopup(payload);
    const count = await reportService.listTotalTransactionTopup(payload);

    return res.status(200).json({
      status: 200, message: 'Succesfully', rows: replaceID(list), total: count,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  ReportMasterRegister,
  ReportTransactionLogConsents,
  ReportTransactionRegisterService,
  ReportReportProblem,
  ReportTransactionBA,
  ReportTransactionTopup,
};
