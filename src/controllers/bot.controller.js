import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import botService from '../services/bot.service.js';
// import { pushMessage } from '../utils/line.js';

const chackAgentChatMode = (payload) => payload;

const endAgentChat = async (req, res) => {
  try {
    await botService.endAgentChat(req.body);

    // pushMessage(req.body.userId, 'สิ้นสุดการสนทนา');

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

export default {
  chackAgentChatMode,
  endAgentChat,
};
