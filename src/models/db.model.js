import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  nissan_customer: { type: Boolean, default: false },
  current_car_brand: { type: String, default: '' },
  interested_car: { type: Array, default: [] },
  buying_plan: { type: String, default: '' },
  buying_factor: { type: Array, default: [] },
  consent: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

const form3Schema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },

  sex: { type: String, default: '' },
  age: { type: String, default: '' },
  status: { type: String, default: '' },
  child_amt: { type: String, default: '' },
  family_member_amt: { type: String, default: '' },
  educate: { type: String, default: '' },
  career: { type: String, default: '' },
  career_optional: { type: String, default: '' },
  monthly_income: { type: String, default: '' },
  buying_purpose: { type: String, default: '' },
  satisfaction_rate_1: { type: String, default: '' },
  satisfaction_rate_2: { type: String, default: '' },
  satisfaction_rate_3: { type: String, default: '' },
  after_drive_test: { type: String, default: '' },
  after_drive_test_reason: { type: String, default: '' },
  offer: { type: String, default: '' },
  other_offer: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
}, { versionKey: false });

export const UserProfile = mongoose.models.users_profile || mongoose.model('users_profile', userProfileSchema);
export const Form3 = mongoose.models.form_3 || mongoose.model('form_3', form3Schema);
