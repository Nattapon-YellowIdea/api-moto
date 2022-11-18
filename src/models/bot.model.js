import mongoose from 'mongoose';

const dateNowTH = new Date();
dateNowTH.setHours(dateNowTH.getHours() + 7);

const transactionAgentChatModeSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  started_at: { type: Date, default: new Date() },
  agent_id: { type: String, default: '' },
  ended_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const transactionAgentChatHistoriesSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  agent_id: { type: String, default: '' },
  user_event: { type: Object, default: null },
  agent_event: { type: Object, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const TransactionAgentChatMode = mongoose.models.transaction_agent_chat_modes || mongoose.model('transaction_agent_chat_modes', transactionAgentChatModeSchema);
const TransactionAgentChatHistories = mongoose.models.transaction_agent_chat_histories || mongoose.model('transaction_agent_chat_histories', transactionAgentChatHistoriesSchema);

export {
  TransactionAgentChatMode,
  TransactionAgentChatHistories,
};
