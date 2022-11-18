import captureException from '../utils/captureException.js';
import { TransactionAgentChatMode, TransactionAgentChatHistories } from '../models/bot.model.js';

const chackAgentChatMode = async (payload) => {
  try {
    const result = TransactionAgentChatMode.where(payload).countDocuments();

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createTransactionAgentChatMode = async (payload) => {
  try {
    const result = new TransactionAgentChatMode(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createTransactionAgentChatHistories = async (payload) => {
  try {
    const result = new TransactionAgentChatHistories(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const endAgentChat = async (payload) => {
  try {
    const result = await TransactionAgentChatMode.findOne({ line_user_id: payload.userId, ended_at: null });
    if (result) {
      result.ended_at = new Date();
      result.save();
    }

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  chackAgentChatMode,
  createTransactionAgentChatMode,
  createTransactionAgentChatHistories,
  endAgentChat,
};
