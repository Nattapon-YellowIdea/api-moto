import _ from 'lodash';
import moment from 'moment-timezone';
import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import { getProfile, pushMessage } from '../utils/line.js';
import eServiceSelectService from '../constant/nt/messages/e-service-select-service.js';
import eServicePayment from '../constant/nt/messages/e-service-payment.js';
import eServiceExternal from '../external/eService.js';
import eServiceService from '../services/e-service.service.js';
import crmExternal from '../external/crm.js';
import { doubleBase64Decrypt, doubleBase64Encrypt } from '../utils/base64encrypt.js';
import termAndConditionService from '../services/termAndCondition.service.js';
import { billingFullName, generate6DigitNumberString, generateRandomStringByLength } from '../utils/helper.js';
import payBillList from '../constant/nt/messages/e-service-payment-bill.js';
import cmsExternal from '../external/cms.js';

const registerForm = async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;
    payload.socialid = doubleBase64Encrypt(payload.socialid);
    payload.mobile = doubleBase64Encrypt(payload.mobile);
    payload.tier = 2;

    if (payload.email) {
      payload.email = doubleBase64Encrypt(payload.email);
      payload.idnumber = doubleBase64Encrypt(payload.idnumber);
      payload.tier = 3;
    }

    const result = await eServiceExternal.signUpWithSocial(payload);

    if (result) {
      const user = await eServiceService.showMasterRegister({ line_user_id: payload.line_user_id });
      payload.socialtype = 2;
      payload.is_activate = false;
      payload.type = 'register';

      payload.code = generate6DigitNumberString();
      payload.ref_code = generateRandomStringByLength(6);

      let consentPayload = {};
      const lineProfile = await getProfile(payload.line_user_id);
      if (user === null) {
        payload.displayname = lineProfile.displayName;

        const createResult = await eServiceService.createMasterRegister(payload);

        consentPayload = {
          line_user_id: payload.line_user_id,
          displayname: createResult.displayname,
          mobile: createResult.mobile,
          email: createResult.email,
          is_consent: createResult.is_consent,
          consent_version: createResult.consent_version,
        };

        await termAndConditionService.createTransactionLogConsent(consentPayload);
      } else {
        // Update Log consent if ver. not equal
        if (user.consent_version !== payload.consent_version) {
          consentPayload.line_user_id = payload.line_user_id;
          consentPayload.displayname = user.displayname;
          consentPayload.mobile = user.mobile;
          consentPayload.email = user.email;
          consentPayload.is_consent = payload.is_consent;
          consentPayload.consent_version = payload.consent_version;

          await termAndConditionService.createTransactionLogConsent(consentPayload);
        }
        await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, payload);
      }

      // Store Data To tagging method
      await cmsExternal.dataPillar([
        {
          line_user_id: payload.line_user_id,
          line_display_name: lineProfile.displayName,
          line_display_image: lineProfile.pictureUrl,
          data_pillar: 'User Register',
          definition: 'Tier',
          data_point: payload.tier.toString(),
        },
      ]);
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', response: result.data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const activateUser = async (req, res) => {
  try {
    const payload = req.body;
    payload['x-clientip'] = req.ip;

    const userData = await eServiceService.showMasterRegister({ line_user_id: payload.line_user_id });

    payload.socialtype = 2;
    payload.activate = 1;

    const result = await eServiceExternal.activateSocialMember(payload);

    if (result) {
      if (userData.tier === 2) {
        payload.mobile = userData.mobile;

        const otpTokenResult = await eServiceExternal.checkMobileMember(payload);

        if (otpTokenResult.data.success === false) {
          return res.status(401).json({ status: 401, message: 'Login Fail' });
        }

        payload.otp_token = doubleBase64Encrypt(otpTokenResult.data.responses.data.otp_token);
      }

      if (userData.tier === 3) {
        payload.email = userData.email;
        payload.password = userData.password;
      }

      const resultLogin = await eServiceExternal.loginWithSocial(payload);

      if (resultLogin) {
        await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, { serviceAccess: resultLogin.data.responses.data.serviceAccess, is_activate: true });
        await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...resultLogin.data.responses.data });

        pushMessage(payload.line_user_id, [
          {
            type: 'text',
            text: 'เข้าสู่ระบบสำเร็จ ท่านสามารถเลือกใช้บริการที่ต้องการใช้งานได้',
          },
          eServiceSelectService(),
        ]);
      }

      return res.status(200).json({ status: 200, message: 'Succesfully' });
    }

    return res.status(500).json({ status: 200, message: 'Error' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const loginWithSocial = async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;
    payload.socialid = doubleBase64Encrypt(payload.socialid);

    const result = await eServiceExternal.loginWithSocial(payload);

    if (result) {
      pushMessage(payload.line_user_id, [
        {
          type: 'text',
          text: 'เข้าสู่ระบบสำเร็จ ท่านสามารถเลือกใช้บริการที่ต้องการใช้งานได้',
        },
        eServiceSelectService(),
      ]);
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', response: result.data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const loginWithEmail = async (req, res) => {
  try {
    const payload = req.body;
    // store profile & other value to master regsiter
    payload['x-clientip'] = req.ip;
    payload.email = doubleBase64Encrypt(payload.email);
    payload.socialid = doubleBase64Encrypt(payload.line_user_id);

    const userValid = await eServiceService.showMasterRegister({ line_user_id: payload.line_user_id });

    const result = await eServiceExternal.loginWithSocial(payload);

    const lineProfile = await getProfile(payload.line_user_id);
    if (userValid === null) {
      const createResult = await eServiceService.createMasterRegister({
        line_user_id: payload.line_user_id,
        tier: parseInt(result.data.responses.data.memberLv, 10),
        socialtype: '2',
        socialid: doubleBase64Encrypt(payload.line_user_id),
        displayname: lineProfile.displayName,
        mobile: payload.mobile,
        email: payload.email,
        password: payload.password,
        idnumbertype: payload.idnumbertype,
        idnumber: payload.idnumber,
        is_consent: payload.is_consent,
        consent_version: payload.consent_version,
        serviceAccess: result.data.responses.data.serviceAccess,
        type: 'login',
        is_activate: true,
        // profile_title: result.data.responses.data.profile.titlename,
        // profile_firstname: result.data.responses.data.profile.firstname,
        // profile_lastname: result.data.responses.data.profile.lastname,
        // profile_gender: result.data.responses.data.profile.gender,
        // profile_email: result.data.responses.data.profile.email,
        // profile_mobile: result.data.responses.data.profile.mobile,
        // profile_idnumberStatus: result.data.responses.data.profile.idnumberStatus,
        // memberId: result.data.responses.data.memberId,
        // memberToken: result.data.responses.data.memberToken,
        // memberType: result.data.responses.data.memberType,
        // memberClass: result.data.responses.data.memberClass,
        // memberLv: result.data.responses.data.memberLv,
      });

      // Update Transaction Login
      await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...result.data.responses.data });

      // เก็บ log การกดยอมรับ
      await termAndConditionService.createTransactionLogConsent({
        line_user_id: payload.line_user_id,
        displayname: createResult.displayname,
        mobile: createResult.mobile,
        email: createResult.email,
        is_consent: createResult.is_consent,
        consent_version: createResult.consent_version,
      });
    } else {
      // Update master register
      await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, {
        tier: parseInt(result.data.responses.data.memberLv, 10),
        socialtype: '2',
        socialid: doubleBase64Encrypt(payload.line_user_id),
        type: 'login',
        email: payload.email,
        password: payload.password,
        serviceAccess: result.data.responses.data.serviceAccess,
        is_activate: true,
        is_consent: payload.is_consent,
        consent_version: payload.consent_version,
        // profile_title: result.data.responses.data.profile.titlename,
        // profile_firstname: result.data.responses.data.profile.firstname,
        // profile_lastname: result.data.responses.data.profile.lastname,
        // profile_gender: result.data.responses.data.profile.gender,
        // profile_email: result.data.responses.data.profile.email,
        // profile_mobile: result.data.responses.data.profile.mobile,
        // profile_idnumberStatus: result.data.responses.data.profile.idnumberStatus,
        // memberId: result.data.responses.data.memberId,
        // memberToken: result.data.responses.data.memberToken,
        // memberType: result.data.responses.data.memberType,
        // memberClass: result.data.responses.data.memberClass,
        // memberLv: result.data.responses.data.memberLv,
      });
      // Update transaction login
      await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...result.data.responses.data });

      // Update Log consent if ver. not equal
      if (userValid.consent_version !== payload.consent_version) {
        await termAndConditionService.createTransactionLogConsent({
          line_user_id: payload.line_user_id,
          displayname: userValid.displayname,
          mobile: userValid.mobile,
          email: userValid.email,
          is_consent: userValid.is_consent,
          consent_version: userValid.consent_version,
        });
      }
    }

    // Store Data To tagging method
    await cmsExternal.dataPillar([
      {
        line_user_id: payload.line_user_id,
        line_display_name: lineProfile.displayName,
        line_display_image: lineProfile.pictureUrl,
        data_pillar: 'User Register',
        definition: 'Tier',
        data_point: result.data.responses.data.memberLv.toString(),
      },
    ]);

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: 'เข้าสู่ระบบสำเร็จ ท่านสามารถเลือกใช้บริการที่ต้องการใช้งานได้',
      },
      eServiceSelectService(),
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: { accessService: result.data.responses.data.serviceAccess } });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const loginWithPhone = async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;
    payload.mobile = doubleBase64Encrypt(payload.mobile);
    payload.socialid = doubleBase64Encrypt(payload.line_user_id);

    const userValid = await eServiceService.showMasterRegister({ line_user_id: payload.line_user_id });

    const otpTokenResult = await eServiceExternal.checkMobileMember(payload);

    if (otpTokenResult.data.success === false) {
      return res.status(401).json({ status: 401, message: 'Login Fail' });
    }
    payload.otp_token = doubleBase64Encrypt(otpTokenResult.data.responses.data.otp_token);

    const result = await eServiceExternal.loginWithSocial(payload);
    const lineProfile = await getProfile(payload.line_user_id);
    if (userValid === null) {
      const createResult = await eServiceService.createMasterRegister({
        line_user_id: payload.line_user_id,
        tier: parseInt(result.data.responses.data.memberLv, 10),
        socialtype: '2',
        socialid: doubleBase64Encrypt(payload.line_user_id),
        type: 'login',
        displayname: lineProfile.displayName,
        mobile: payload.mobile,
        idnumbertype: payload.idnumbertype,
        idnumber: payload.idnumber,
        is_consent: payload.is_consent,
        consent_version: payload.consent_version,
        serviceAccess: result.data.responses.data.serviceAccess,
        is_activate: false,
        code: generate6DigitNumberString(),
        ref_code: generateRandomStringByLength(6),
        // profile_title: result.data.responses.data.profile.titlename,
        // profile_firstname: result.data.responses.data.profile.firstname,
        // profile_lastname: result.data.responses.data.profile.lastname,
        // profile_gender: result.data.responses.data.profile.gender,
        // profile_email: result.data.responses.data.profile.email,
        // profile_mobile: result.data.responses.data.profile.mobile,
        // profile_idnumberStatus: result.data.responses.data.profile.idnumberStatus,
        // memberId: result.data.responses.data.memberId,
        // memberToken: result.data.responses.data.memberToken,
        // memberType: result.data.responses.data.memberType,
        // memberClass: result.data.responses.data.memberClass,
        // memberLv: result.data.responses.data.memberLv,
      });

      // Update Transaction Login
      await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...result.data.responses.data });

      // เก็บ log การกดยอมรับ
      await termAndConditionService.createTransactionLogConsent({
        line_user_id: payload.line_user_id,
        displayname: createResult.displayname,
        mobile: createResult.mobile,
        email: createResult.email,
        is_consent: createResult.is_consent,
        consent_version: createResult.consent_version,
      });
    } else {
      // Update master register
      await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, {
        tier: parseInt(result.data.responses.data.memberLv, 10),
        socialtype: '2',
        socialid: doubleBase64Encrypt(payload.line_user_id),
        mobile: payload.mobile,
        serviceAccess: result.data.responses.data.serviceAccess,
        type: 'login',
        is_activate: false,
        code: generate6DigitNumberString(),
        ref_code: generateRandomStringByLength(6),
        is_consent: payload.is_consent,
        consent_version: payload.consent_version,
        // profile_title: result.data.responses.data.profile.titlename,
        // profile_firstname: result.data.responses.data.profile.firstname,
        // profile_lastname: result.data.responses.data.profile.lastname,
        // profile_gender: result.data.responses.data.profile.gender,
        // profile_email: result.data.responses.data.profile.email,
        // profile_mobile: result.data.responses.data.profile.mobile,
        // profile_idnumberStatus: result.data.responses.data.profile.idnumberStatus,
        // memberId: result.data.responses.data.memberId,
        // memberToken: result.data.responses.data.memberToken,
        // memberType: result.data.responses.data.memberType,
        // memberClass: result.data.responses.data.memberClass,
        // memberLv: result.data.responses.data.memberLv,
      });
      // Update transaction login
      await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...result.data.responses.data });

      // Update Log consent if ver. not equal
      if (userValid.consent_version !== payload.consent_version) {
        await termAndConditionService.createTransactionLogConsent({
          line_user_id: payload.line_user_id,
          displayname: userValid.displayname,
          mobile: userValid.mobile,
          email: userValid.email,
          is_consent: userValid.is_consent,
          consent_version: userValid.consent_version,
        });
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: { accessService: result.data.responses.data.serviceAccess } });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const getOtpRefCode = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceService.getOTPRefCode(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const requestOtp = async (req, res) => {
  try {
    const payload = req.body;

    if (payload.type === 'New') {
      await eServiceService.updateMasterRegister(
        { line_user_id: payload.line_user_id },
        { code: generate6DigitNumberString(), ref_code: generateRandomStringByLength(6) },
      );
    }

    const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });
    const payloadOtpRequest = {
      otpNumber: userDetail.code,
      phoneNumber: doubleBase64Decrypt(userDetail.mobile),
      ref_code: userDetail.ref_code,
    };

    await eServiceService.requestOTP(payloadOtpRequest);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const confirmOtp = async (req, res) => {
  try {
    const payload = req.body;

    const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });

    if (userDetail.code !== payload.otp_number) {
      return res.status(401).json({ status: 401, message: 'Wrong OTP number.' });
    }

    payload['x-clientip'] = req.ip;
    payload.socialid = userDetail.socialid;
    payload.socialtype = 2;
    payload.activate = 1;

    const activateResult = await eServiceExternal.activateSocialMember(payload);

    if (activateResult) {
      if (userDetail.tier === 2) {
        payload.mobile = userDetail.mobile;

        const otpTokenResult = await eServiceExternal.checkMobileMember(payload);

        if (otpTokenResult.data.success === false) {
          return res.status(401).json({ status: 401, message: 'Login Fail' });
        }
        payload.otp_token = doubleBase64Encrypt(otpTokenResult.data.responses.data.otp_token);
      }

      if (userDetail.tier === 3) {
        payload.email = userDetail.email;
        payload.password = userDetail.password;
      }

      const resultLogin = await eServiceExternal.loginWithSocial(payload);

      if (resultLogin) {
        const lineProfile = await getProfile(payload.line_user_id);

        await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, { serviceAccess: resultLogin.data.responses.data.serviceAccess, is_activate: true });
        await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { ...resultLogin.data.responses.data });

        pushMessage(payload.line_user_id, [
          {
            type: 'text',
            text: 'เข้าสู่ระบบสำเร็จ ท่านสามารถเลือกใช้บริการที่ต้องการใช้งานได้',
          },
          eServiceSelectService(),
        ]);

        // Store Data To tagging method
        await cmsExternal.dataPillar([
          {
            line_user_id: payload.line_user_id,
            line_display_name: lineProfile.displayName,
            line_display_image: lineProfile.pictureUrl,
            data_pillar: 'User Register',
            definition: 'Tier',
            data_point: resultLogin.data.responses.data.memberLv.toString(),
          },
        ]);
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const confirmOtpLogin = async (req, res) => {
  try {
    const payload = req.body;

    const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });

    if (userDetail.code !== payload.otp_number) {
      return res.status(401).json({ status: 401, message: 'Wrong OTP number.' });
    }

    await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, { is_activate: true });

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: 'เข้าสู่ระบบสำเร็จ ท่านสามารถเลือกใช้บริการที่ต้องการใช้งานได้',
      },
      eServiceSelectService(),
    ]);
    const lineProfile = await getProfile(payload.line_user_id);

    // Store Data To tagging method
    await cmsExternal.dataPillar([
      {
        line_user_id: payload.line_user_id,
        line_display_name: lineProfile.displayName,
        line_display_image: lineProfile.pictureUrl,
        data_pillar: 'User Register',
        definition: 'Tier',
        data_point: userDetail.tier.toString(),
      },
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const changePassword = async (req, res) => {
  try {
    const payload = req.body;

    const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });

    if (userDetail.password === '' || userDetail.password !== payload.current_password) {
      return res.status(401).json({ status: 401, message: 'Current password not match.' });
    }

    const changeResult = await eServiceExternal.changeMemberPwd(payload);

    if (changeResult) {
      await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, { password: payload.new_password });
    }

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const payment = async (req, res) => {
  try {
    const payload = req.body;

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: 'ใบกำกับภาษี/ใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Tax/E-Receipt) จะถูกส่งไปยัง SMS/EMAIL ตามที่ท่านให้ไว้ ขอบคุณที่ใช้บริการ',
      },
      eServicePayment(),
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const addBa = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.addBa(payload);

    if (result) {
      await eServiceService.createTransactionBA({
        line_user_id: payload.line_user_id,
        ba: payload.ba,
        serviceno: payload.serviceno,
        admin: 'add',
      });
      return res.status(200).json({ status: 200, message: 'Succesfully', response: result.data });
    }

    return res.status(500).json({ status: 500, message: 'Error' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const removeBa = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.removeBa(payload);

    if (result) {
      await eServiceService.createTransactionBA({
        line_user_id: payload.line_user_id,
        ba: payload.ba,
        serviceno: payload.serviceno,
        admin: 'remove',
      });
      return res.status(200).json({ status: 200, message: 'Succesfully', response: result.data });
    }

    return res.status(500).json({ status: 500, message: 'Error' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const getBaLists = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.getBaLists(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', response: result.data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const billList = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.getBaLists(payload);

    const userData = await eServiceService.getUserData({ line_user_id: payload.line_user_id });

    const { fixedline, mobile } = result.data.responses.data.balists;
    const datenow = moment.tz(new Date(), 'Asia/Bangkok');
    datenow.add(543, 'years');

    if (_.isArray(fixedline)) {
      if (fixedline.length > 0) {
        await Promise.all(fixedline.map(async (item) => {
          const fixedlineResult = await crmExternal.crmQueryBillSummaryForLatestDebtPS({
            transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
            integrationKeyRef: 'LINEAPP',
            accountNum: item.baid,
          });

          const fullNameResult = await crmExternal.crmQueryBaPs({
            transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
            integrationKeyRef: 'LINEAPP',
            billingAccountId: item.baid,
          });

          const eachItem = item;
          let soapBody = {};
          let soapBABody = {};
          let dataResponse = {};
          const eachBaData = {
            accountnum: '',
            note: '',
            fullName: '',
            data: [],
          };

          if (fullNameResult.data['soapenv:body']) {
            if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']) {
              if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']) {
                if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']) {
                  if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo']) {
                    soapBABody = fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo'];
                    eachBaData.fullName = billingFullName((soapBABody['com1:legalname']), userData.tier);
                  }
                }
              }
            }
          }

          if (fixedlineResult.data['soapenv:body']) {
            if (fixedlineResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']) {
              if (fixedlineResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']) {
                if (fixedlineResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']) {
                  if (fixedlineResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']['rbm1:searchreturn']) {
                    soapBody = fixedlineResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']['rbm1:searchreturn'];
                    eachBaData.accountnum = soapBody['rbm1:accountnum'];
                    eachBaData.note = soapBody['rbm1:note'];

                    if (soapBody['rbm1:data']) {
                      dataResponse = soapBody['rbm1:data'];

                      if (_.isArray(dataResponse)) {
                        eachBaData.data = dataResponse;
                      } else {
                        eachBaData.data.push(dataResponse);
                      }
                    }
                  }
                }
              }
            }
          }
          eachItem.bill_summary = eachBaData;
        }));
      }
    }

    if (_.isArray(mobile)) {
      if (mobile.length > 0) {
        await Promise.all(mobile.map(async (item) => {
          const mobileResult = await crmExternal.crmQueryBillSummaryForLatestDebtPS({
            transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
            integrationKeyRef: 'LINEAPP',
            accountNum: item.baid,
          });

          const fullNameResult = await crmExternal.crmQueryBaPs({
            transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
            integrationKeyRef: 'LINEAPP',
            billingAccountId: item.baid,
          });

          const eachItem = item;
          let soapBody = {};
          let soapBABody = {};
          let dataResponse = {};
          const eachBaData = {
            accountnum: '',
            note: '',
            fullName: '',
            data: [],
          };

          if (fullNameResult.data['soapenv:body']) {
            if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']) {
              if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']) {
                if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']) {
                  if (fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo']) {
                    soapBABody = fullNameResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo'];
                    eachBaData.fullName = billingFullName((soapBABody['com1:legalname']), userData.tier);
                  }
                }
              }
            }
          }

          if (mobileResult.data['soapenv:body']) {
            if (mobileResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']) {
              if (mobileResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']) {
                if (mobileResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']) {
                  if (mobileResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']['rbm1:searchreturn']) {
                    soapBody = mobileResult.data['soapenv:body']['rbm:rbmquerybillsummaryforlatestdebt_psresponse']['rbm1:rbmquerybillsummaryforlatestdebtresponse']['rbm1:body']['rbm1:searchreturn'];
                    eachBaData.accountnum = soapBody['rbm1:accountnum'];
                    eachBaData.note = soapBody['rbm1:note'];

                    if (soapBody['rbm1:data']) {
                      dataResponse = soapBody['rbm1:data'];

                      if (_.isArray(dataResponse)) {
                        eachBaData.data = dataResponse;
                      } else {
                        eachBaData.data.push(dataResponse);
                      }
                    }
                  }
                }
              }
            }
          }
          eachItem.bill_summary = eachBaData;
        }));
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const checkRegister = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceService.checkRegister(payload);

    if (!result) {
      return res.status(200).json({ status: 200, message: 'Succesfully', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const checkFollow = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceService.checkFollow(payload);

    if (!result) {
      return res.status(200).json({ status: 200, message: 'Succesfully', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const requestMemberToken = async (req, res) => {
  try {
    const payload = req.body;

    const userDataResult = await eServiceService.getUserData({ line_user_id: payload.line_user_id });
    const transactionLoginResult = await eServiceService.getTransactionLogin({ line_user_id: userDataResult.line_user_id });
    const requestTokenPayload = {
      socialtype: 2,
      socialid: userDataResult.socialid,
      refresh_token: transactionLoginResult.refreshToken.token,
      'x-clientip': payload['x-clientip'],
    };

    const result = await eServiceExternal.requestMemberToken(requestTokenPayload);

    if (result.data.success === false) {
      return res.status(400).json({ status: 400, message: 'request new token fail' });
    }

    await eServiceService.updateNewToken({ line_user_id: payload.line_user_id }, { serviceAccess: result.data.responses.data.serviceAccess });
    await eServiceService.updateTransactionLogin({ line_user_id: payload.line_user_id }, { line_user_id: payload.line_user_id, ...result.data.responses.data });

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result.data.responses.data });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const payBill = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceService.createTransactionPayBill(payload);
    const payloadPayBill = {
      'x-clientip': payload['x-clientip'],
      requestid: result._id,
      channel_product_code: process.env.E_SERVICE_PAYBILL_CHANNEL_PRODUCT_CODE,
      channel_service_code: process.env.E_SERVICE_PAYBILL_CHANNEL_SERVICE_CODE,
      order_ref: result._id,
      balists: payload.balists,
      service_access_token: payload.service_access_token,
    };

    const resultPayBill = await eServiceExternal.payBill(payloadPayBill);

    await eServiceService.updateTransactionPayBill({ _id: result._id }, { response: resultPayBill.data });

    return res.status(200).json({
      status: 200,
      message: 'Succesfully',
      data: resultPayBill,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const getBillingDetail = async (req, res) => {
  try {
    const payload = req.body;

    payload.transactionref = doubleBase64Decrypt(payload.transactionRef);

    const resultBillDetail = await eServiceExternal.paymentDetails(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: resultBillDetail });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const updateTransactionPayBill = async (req, res) => {
  try {
    const payload = req.body;

    const transactionRefIsExist = await eServiceService.checkeTransactionRefExists({ transactionRef: payload.transactionRef });

    payload.transactionref = doubleBase64Decrypt(payload.transactionRef);

    const resultBillDetail = await eServiceExternal.paymentDetails(payload);

    if (!transactionRefIsExist) {
      await eServiceService.updateTransactionPayBill({ _id: doubleBase64Decrypt(payload.orderRefId) }, { transactionRef: payload.transactionRef });

      pushMessage(payload.line_user_id, [
        {
          type: 'text',
          text: 'ใบกำกับภาษี/ใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Tax/E-Receipt) จะถูกส่งไปยัง SMS/EMAIL ตามที่ท่านให้ไว้ ขอบคุณที่ใช้บริการ',
        },
        payBillList(resultBillDetail.data.responses.data, payload.transactionRef, payload.orderRefId),
      ]);
    }

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const getTransactionPayBill = async (req, res) => {
  try {
    const payload = req.body;

    payload.orderRefId = doubleBase64Decrypt(payload.orderRefId);

    const result = await eServiceService.getTransactionPayBill(payload.orderRefId);

    if (!result) {
      return res.status(404).json({ status: 404, message: 'orderRefId not found.', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const payload = req.body;

    payload.email = doubleBase64Encrypt(payload.email);
    payload.socialtype = 2;
    payload.socialid = doubleBase64Encrypt(payload.line_user_id);

    await eServiceExternal.forgotPwd(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const resetPassword = async (req, res) => {
  try {
    // const payload = req.body;

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return res.status(400).json({ status: 400, message: err.message });
  }
};

const updateBillAlert = async (req, res) => {
  try {
    const payload = req.body;

    await eServiceService.updateMasterRegister({ line_user_id: payload.line_user_id }, { bill_alert_before_due: payload.before_due, bill_alert_after_due: payload.after_due });

    const result = await eServiceExternal.updateBillAlert(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const getMemberProfile = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.getMemberProfile(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const updateMemberProfile = async (req, res) => {
  try {
    const payload = req.body;

    payload.mobile = doubleBase64Encrypt(payload.mobile);
    payload.email = doubleBase64Encrypt(payload.email);
    payload.idnumber = doubleBase64Encrypt(payload.idnumber);
    payload.consent = payload.is_consent ? '1' : '2';

    const updateResult = await eServiceExternal.updateMemberProfile(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: updateResult });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const regsiterEBill = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.getUpdateBaInfoNew(payload);

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: `สมัครบริการ e-Bill
หมายเลขบริการ ${payload.serviceno} สำเร็จ

ท่านจะได้รับ e-Bill ในรอบบิลถัดไป`,
      },
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const updateEBill = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.getUpdateBaInfoChange(payload);

    pushMessage(payload.line_user_id, [
      {
        type: 'text',
        text: `แก้ไขอีเมลรับ e-Bill สำเร็จ
ระบบบันทึกอีเมลใหม่ของท่านเรียบร้อยแล้ว
ท่านจะได้รับ e-Bill รอบบิลถัดไปในอีเมลใหม่ที่ท่านได้กรอกไว้`,
      },
    ]);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }
    return res.status(status).json({ status, message: err.message, data });
  }
};

const requestOtpBill = async (req, res) => {
  try {
    const payload = req.body;
    let result;

    if (payload.type === 'Update') {
      result = await eServiceService.updateTransactionVerifyOtp(
        { line_user_id: payload.line_user_id },
        { otpNumber: generate6DigitNumberString(), ref_code: generateRandomStringByLength(6) },
      );
    }

    if (payload.type === 'New') {
      result = await eServiceService.createTransactionVerifyOtp({
        ...payload,
        otpNumber: generate6DigitNumberString(),
        ref_code: generateRandomStringByLength(6),
      });
    }

    const payloadOtpRequest = {
      otpNumber: result.otpNumber,
      phoneNumber: result.phoneNumber,
      ref_code: result.ref_code,
    };

    await eServiceService.requestOTP(payloadOtpRequest);

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const getOtpBill = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceService.getTransactionVerifyOtp({ line_user_id: payload.line_user_id });

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const confirmOtpBill = async (req, res) => {
  try {
    const payload = req.body;

    const otpDetail = await eServiceService.getTransactionVerifyOtp({ line_user_id: payload.line_user_id });

    if (otpDetail.otpNumber !== payload.otp_number) {
      return res.status(401).json({ status: 401, message: 'Wrong OTP number.' });
    }

    await eServiceService.updateTransactionVerifyOtp({ line_user_id: payload.line_user_id }, { is_activate: true, updated_at: new Date() });

    return res.status(200).json({ status: 200, message: 'Succesfully' });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const updateMemberTier = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.updateMemberTier(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const checkEbill = async (req, res) => {
  try {
    const payload = req.body;
    const datenow = moment.tz(new Date(), 'Asia/Bangkok');
    datenow.add(543, 'years');

    const checkResult = await crmExternal.crmQueryBaPs({
      transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
      integrationKeyRef: 'LINEAPP',
      billingAccountId: payload.ba,
    });

    let baData = null;
    if (checkResult.data['soapenv:body']) {
      if (checkResult.data['soapenv:body']['new:queryba_psresponse']) {
        if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']) {
          if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']) {
            if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo']) {
              baData = checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo']['com1:billhandlingcode'];
            }
          }
        }
      }
    }

    return res.status(200).json({ status: 200, message: 'Succesfully', data: baData });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const getBillAddress = async (req, res) => {
  try {
    const payload = req.body;
    const datenow = moment.tz(new Date(), 'Asia/Bangkok');
    datenow.add(543, 'years');

    const checkResult = await crmExternal.crmQueryBaPs({
      transactionId: `LINEAPP${datenow.format('YYYYMMDDHHmmss')}`,
      integrationKeyRef: 'LINEAPP',
      billingAccountId: payload.ba,
    });

    let accountData = null;
    if (checkResult.data['soapenv:body']) {
      if (checkResult.data['soapenv:body']['new:queryba_psresponse']) {
        if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']) {
          if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']) {
            if (checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body']['acc:accountinfo']) {
              accountData = checkResult.data['soapenv:body']['new:queryba_psresponse']['acc:querybaresponse']['acc:body'];
            }
          }
        }
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'Succesfully',
      data: accountData,
    });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const updateBillAddress = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.changeBillAddrInfo(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const updateBillEmail = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.changeEmailInfo(payload);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const updateBillPhoneNumber = async (req, res) => {
  try {
    const payload = req.body;

    const result = await eServiceExternal.changeContactInfo(payload.contact_mobile);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

const socialBlock = async (req, res) => {
  try {
    const payload = req.body;

    const userDetail = await eServiceService.getUserData({ line_user_id: payload.line_user_id });

    const payloadRequest = {
      socialtype: 2,
      socialid: userDetail.socialid,
      scope: 'block',
    };

    const result = await eServiceExternal.socialBlock(payloadRequest);

    return res.status(200).json({ status: 200, message: 'Succesfully', data: result });
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    let status = 500;
    let data = {};

    if (err.response) {
      if (err.response.data) {
        data = err.response.data;

        if (err.response.data.statusCode) {
          status = err.response.data.statusCode;
        }
      }
    }

    return res.status(400).json({ status, message: err.message, data });
  }
};

export default {
  registerForm,
  activateUser,
  payment,
  loginWithSocial,
  loginWithEmail,
  loginWithPhone,
  requestOtp,
  confirmOtp,
  changePassword,
  addBa,
  removeBa,
  getBaLists,
  billList,
  checkRegister,
  requestMemberToken,
  payBill,
  getOtpRefCode,
  confirmOtpLogin,
  updateTransactionPayBill,
  getTransactionPayBill,
  getBillingDetail,
  forgotPassword,
  resetPassword,
  checkFollow,
  updateBillAlert,
  getMemberProfile,
  updateMemberProfile,
  regsiterEBill,
  updateEBill,
  requestOtpBill,
  getOtpBill,
  confirmOtpBill,
  updateMemberTier,
  checkEbill,
  getBillAddress,
  updateBillAddress,
  updateBillEmail,
  updateBillPhoneNumber,
  socialBlock,
};
