import { MasterLineUser } from '../../../models/line.model.js';
import eServiceService from '../../../services/e-service.service.js';
import cmsExternal from '../../../external/cms.js';
import eServiceExternal from '../../../external/eService.js';
import { doubleBase64Encrypt } from '../../../utils/base64encrypt.js';

const handleEvent = async (event) => {
  try {
    await eServiceExternal.lineBlock({
      'x-clientip': '0.0.0.0',
      socialtype: 2,
      socialid: doubleBase64Encrypt(event.source.userId),
      scope: 'block',
    });

    return Promise.all([
      MasterLineUser.updateOne({ line_user_id: event.source.userId }, {
        is_follow: false,
      }),
      eServiceService.deleteTransactionLogin({ line_user_id: event.source.userId }),
      eServiceService.updateMasterRegister({ line_user_id: event.source.userId }, {
        tier: 1,
        socialtype: '',
        socialid: '',
        mobile: '',
        email: '',
        password: '',
        idnumbertype: '',
        idnumber: '',
        is_activate: false,
        is_consent: 'false',
        consent_version: null,
        serviceAccess: '',
        type: '',
        code: '',
        ref_code: '',
        updated_at: new Date(),
      }),
      cmsExternal.dataPillar([{
        line_user_id: event.source.userId,
        line_display_name: '',
        line_display_image: '',
        data_pillar: 'Line',
        definition: 'Webhook',
        data_point: 'unfollow',
      }]),
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
};

const message = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all(data.events.map(handleEvent));
};

export default message;
