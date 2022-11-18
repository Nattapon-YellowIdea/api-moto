import mongoose from 'mongoose';

const dateNowTH = new Date();
dateNowTH.setHours(dateNowTH.getHours() + 7);

const transactionExternalLogActivitiesSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  service: { type: String, default: '' },
  module: { type: String, default: '' },
  payload: { type: Object, default: null },
  status: { type: Number, default: null },
  response: { type: Object, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const TransactionExternalLogActivities = mongoose.models.transaction_external_log_activities || mongoose.model('transaction_external_log_activities', transactionExternalLogActivitiesSchema);

export {
  // eslint-disable-next-line import/prefer-default-export
  TransactionExternalLogActivities,
};
