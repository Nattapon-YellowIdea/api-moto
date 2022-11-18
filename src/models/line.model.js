import mongoose from 'mongoose';

const dateNowTH = new Date();
dateNowTH.setHours(dateNowTH.getHours() + 7);

const masterLineUserSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  line_display_name: { type: String, default: '' },
  line_display_img: { type: String, default: '' },
  is_follow: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const transactionLineWebhookSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  data: { type: Object, default: null },
  webhook_event: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const MasterLineUser = mongoose.models.master_line_users || mongoose.model('master_line_users', masterLineUserSchema);
const TransactionLineWebhook = mongoose.models.transaction_line_webhook_histories || mongoose.model('transaction_line_webhook_histories', transactionLineWebhookSchema);

export {
  MasterLineUser,
  TransactionLineWebhook,
};
