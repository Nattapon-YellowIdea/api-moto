import { pushMessage } from '../../../utils/line.js';
import botService from '../../../services/bot.service.js';

async function handleEvent(event) {
  try {
    return Promise.all([
      pushMessage(event.pushMessage.to, event.pushMessage.messages),
      botService.createTransactionAgentChatHistories({ line_user_id: event.pushMessage.to, agent_id: event.agentId, agent_event: event }),
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
}

const keyword = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all([handleEvent(data)]);
};

export default keyword;
