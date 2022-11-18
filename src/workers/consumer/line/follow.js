import logger from '../../../config/winston.js';
import { MasterLineUser } from '../../../models/line.model.js';
import { MasterRegister } from '../../../models/nt.model.js';
import { getProfile } from '../../../utils/line.js';
import eServiceExternal from '../../../external/eService.js';
import cmsExternal from '../../../external/cms.js';
import { doubleBase64Encrypt } from '../../../utils/base64encrypt.js';

const handleEvent = async (event) => {
  try {
    const lineProfile = await getProfile(event.source.userId);

    const countLineUser = await MasterLineUser.countDocuments({ line_user_id: event.source.userId });

    if (!countLineUser) {
      return Promise.all([
        MasterLineUser.create({
          line_user_id: event.source.userId,
          line_display_name: lineProfile.displayName,
          line_display_img: lineProfile.pictureUrl,
        }),
        MasterRegister.create({
          line_user_id: event.source.userId,
          displayname: lineProfile.displayName,
        }),
        eServiceExternal.lineFollow({
          'x-clientip': '0.0.0.0',
          socialtype: 2,
          socialid: doubleBase64Encrypt(event.source.userId),
          displayname: lineProfile.displayName,
        }),
        cmsExternal.dataPillar([{
          line_user_id: event.source.userId,
          line_display_name: lineProfile.displayName,
          line_display_image: lineProfile.pictureUrl,
          data_pillar: 'Line',
          definition: 'Webhook',
          data_point: 'follow',
        },
        {
          line_user_id: event.source.userId,
          line_display_name: lineProfile.displayName,
          line_display_image: lineProfile.pictureUrl,
          data_pillar: 'Personal',
          definition: 'userID',
          data_point: event.source.userId,
        },
        {
          line_user_id: event.source.userId,
          line_display_name: lineProfile.displayName,
          line_display_image: lineProfile.pictureUrl,
          data_pillar: 'User Register',
          definition: 'Tier',
          data_point: '1',
        }]),
      ]);
    }

    return Promise.all([
      MasterLineUser.updateOne({ line_user_id: event.source.userId }, {
        is_follow: true,
      }),
      eServiceExternal.lineBlock({
        'x-clientip': '0.0.0.0',
        socialtype: 2,
        socialid: doubleBase64Encrypt(event.source.userId),
        scope: 'unblock',
      }),
      cmsExternal.dataPillar([{
        line_user_id: event.source.userId,
        line_display_name: lineProfile.displayName,
        line_display_image: lineProfile.pictureUrl,
        data_pillar: 'Line',
        definition: 'Webhook',
        data_point: 'follow',
      },
      {
        line_user_id: event.source.userId,
        line_display_name: lineProfile.displayName,
        line_display_image: lineProfile.pictureUrl,
        data_pillar: 'User Register',
        definition: 'Tier',
        data_point: '1',
      }]),
    ]);
  } catch (err) {
    logger.error(err);
    return Promise.reject(err);
  }
};

const message = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all(data.events.map(handleEvent));
};

export default message;
