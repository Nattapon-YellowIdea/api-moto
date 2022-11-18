import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import reportProblemService from '../services/reportProblem.service.js';
import wsscomsExternal from '../external/wsscoms.js';
import { pushMessage } from '../utils/line.js';
import cmsExternal from '../external/cms.js';

const tierForm = async (req, res) => {
  try {
    const payload = req.body;
    let customerTitle = '';
    customerTitle = payload.customer_title;
    if (payload.customer_title === 'อื่นๆ (โปรดระบุ)') {
      customerTitle = payload.customer_title_optional;
    }

    if (payload.service_type === 'M0001') {
      return res.status(200).json({ status: 200, message: 'Succesfully', data: 'forward email' });
    }
    const payloadCallBackListWeb = {
      callbackNumber: payload.customer_mobile,
      phoneNumber: payload.service_number,
      serviceType: payload.service_type,
      reason: payload.reason,
      callName: `${customerTitle}${payload.customer_first_name} ${payload.customer_last_name}`,
      memo: payload.detail,
      email: payload.customer_email,
    };

    const result = await wsscomsExternal.callBackListWeb(payloadCallBackListWeb);

    if (result.data) {
      if (result.data['soap:body']) {
        if (result.data['soap:body'].callbacklistwebtyperesponse) {
          if (result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult) {
            if (result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult.result_code === '0') {
              return res.status(400).json({ status: 400, message: 'result_code = 0' });
            }
            const isExist = await reportProblemService.findTransactionReportProblem({ line_user_id: payload.line_user_id, ticket: result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult.ticket });

            if (!isExist) {
              payload.result_code = result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult.result_code;
              payload.ticket = result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult.ticket;
              await reportProblemService.createTransactionReportProblem(payload);
            }

            pushMessage(payload.line_user_id, [
              {
                type: 'text',
                text: `ท่านได้ทำการแจ้งปัญหาสำเร็จ\n\nระบบได้บันทึกข้อมูลการแจ้งปัญหาของท่านเรียบร้อย\nแล้ว NT จะรีบดำเนินการแก้ไขปัญหาของท่านโดยเร็ว\nท่านสามารถติดตามผลความคืบหน้าการแก้ไขปัญหา\nได้ที่เมนูแจ้งปัญหา>ตรวจสอบสถานะ\n\nหมายเลขอ้างอิง ${result.data['soap:body'].callbacklistwebtyperesponse.callbacklistwebtyperesult.ticket}\n(กรุณาจดจำหมายเลขอ้างอิง เพื่อใช้\nในการตรวจสอบความคืบหน้าการ\nแก้ไขปัญหา)\n`,
              },
            ]);
          }
        }
      }
    }
    // Store Data To tagging method
    await cmsExternal.dataPillar([
      {
        line_user_id: payload.line_user_id,
        line_display_name: '',
        line_display_image: '',
        data_pillar: 'Report issue',
        definition: payload.service_type_name,
        data_point: payload.reason_name,
      },
    ]);
    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getStatusByTicket = async (req, res) => {
  try {
    const payload = req.body;

    const payloadGetStatusByTicket = {
      user: 'scoms',
      pass: 'scoms',
      ticket: payload.ticket,
    };

    const result = await wsscomsExternal.getStatusByTicket(payloadGetStatusByTicket);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: { data: JSON.parse(result.data), statusCode: result.statusCode } });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const getFeedbackList = async (req, res) => {
  try {
    const payload = req.body;

    const result = await reportProblemService.getListFeedback({ line_user_id: payload.line_user_id });

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  tierForm,
  getStatusByTicket,
  getFeedbackList,
};
