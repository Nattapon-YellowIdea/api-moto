import _ from 'lodash';
import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import { pushMessage } from '../utils/line.js';
import fttxExternal from '../external/fttx.js';
import trackStatusNotFound from '../constant/nt/messages/track-status-not-found.js';
import trackStatusCheckInformation from '../constant/nt/messages/track-status-check-information.js';
import trackStatusPayForInstallation from '../constant/nt/messages/track-status-pay-for-installation.js';
import trackStatusScheduleInstallationDate from '../constant/nt/messages/track-status-schedule-installation-date.js';
import trackStatusWaitInstallationDate from '../constant/nt/messages/track-status-wait-installation-date.js';
import trackStatusInstallationComplete from '../constant/nt/messages/track-status-installation-complete.js';
import trackStatusError from '../constant/nt/messages/track-status-error.js';

const getTrackStatus = async (req, res) => {
  try {
    const payload = req.body;

    const result = await fttxExternal.getCheckOrderStatus({
      value: payload.tracking_number,
    });

    if (result.data['soap-env:body']) {
      if (result.data['soap-env:body']['ns1:getcheckorderstatusresponse']) {
        if (result.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return) {
          if (result.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return.item) {
            const { item } = result.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return;
            if (item instanceof Array) {
              const data = _.find(item, (o) => o.key === 'status_id');

              if (data) {
                if (data.value === '1' || data.value === '2' || data.value === '7' || data.value === '14' || data.value === '20' || data.value === '24' || data.value === '25' || data.value === '26') {
                  pushMessage(payload.line_user_id, trackStatusCheckInformation(payload));
                } else if (data.value === '11') {
                  pushMessage(payload.line_user_id, trackStatusPayForInstallation(payload));
                } else if (data.value === '3' || data.value === '4' || data.value === '21') {
                  pushMessage(payload.line_user_id, trackStatusScheduleInstallationDate(payload));
                } else if (data.value === '5' || data.value === '8' || data.value === '22') {
                  pushMessage(payload.line_user_id, trackStatusWaitInstallationDate(payload));
                } else if (data.value === '6' || data.value === '9' || data.value === '10' || data.value === '15' || data.value === '16' || data.value === '17' || data.value === '18' || data.value === '23') {
                  pushMessage(payload.line_user_id, trackStatusInstallationComplete(payload));
                } else {
                  pushMessage(payload.line_user_id, trackStatusNotFound(payload));
                }
              } else {
                pushMessage(payload.line_user_id, trackStatusNotFound(payload));
              }
            } else {
              pushMessage(payload.line_user_id, trackStatusNotFound(payload));
            }
          } else {
            pushMessage(payload.line_user_id, trackStatusError(payload));
          }
        } else {
          pushMessage(payload.line_user_id, trackStatusError(payload));
        }
      } else {
        pushMessage(payload.line_user_id, trackStatusError(payload));
      }
    } else {
      pushMessage(payload.line_user_id, trackStatusError(payload));
    }

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  getTrackStatus,
};
