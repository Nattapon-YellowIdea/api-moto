import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  line_user_id: { type: String, default: '' },
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  nissan_customer: { type: String, default: '' },
  current_car_brand: { type: String, default: '' },
  interested_car: { type: String, default: '' },
  buying_plan: { type: String, default: '' },
  buying_factor: { type: String, default: '' },
  consent_1: { type: String, default: '' },
  consent_2: { type: String, default: '' },
  consent_3: { type: String, default: '' },
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
