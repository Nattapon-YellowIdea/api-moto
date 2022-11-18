import https from 'https';
import axios from 'axios';
import captureException from '../utils/captureException.js';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const lineFollow = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
      displayname: payload.displayname,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/follow`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const signUpWithSocial = async (payload) => {
  try {
    let body;

    if (payload.email) {
      body = JSON.stringify({
        socialtype: 2,
        socialid: payload.socialid,
        displayname: payload.displayname,
        mobile: payload.mobile,
        email: payload.email,
        password: payload.password,
        // eslint-disable-next-line radix
        idnumbertype: parseInt(payload.idnumbertype),
        idnumber: payload.idnumber,
      });
    } else {
      body = JSON.stringify({
        socialtype: 2,
        socialid: payload.socialid,
        displayname: payload.displayname,
        mobile: payload.mobile,
      });
    }

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/signup/line`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const loginWithSocial = async (payload) => {
  try {
    let body;

    if (payload.mobile) {
      body = JSON.stringify({
        loginpage: 1,
        type: 2,
        mobile: payload.mobile,
        otp_token: payload.otp_token,
        socialtype: '2',
        socialid: payload.socialid,
      });
    } else if (payload.email) {
      body = JSON.stringify({
        loginpage: 1,
        type: 1,
        email: payload.email,
        password: payload.password,
        socialtype: '2',
        socialid: payload.socialid,
      });
    } else {
      body = JSON.stringify({
        loginpage: 1,
        type: 3,
        socialtype: 2,
        socialid: payload.socialid,
      });
    }

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/login/`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkMobileMember = async (payload) => {
  try {
    const body = JSON.stringify({
      mobile: payload.mobile,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/checkmobile/`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const checkSocialMember = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/check`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const activateSocialMember = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
      activate: payload.activate,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/activate`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const requestMemberToken = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
      refresh_token: payload.refresh_token,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/users/request/token`,
      headers: {
        'x-service-access': '',
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getBaLists = async (payload) => {
  try {
    const config = {
      httpsAgent,
      method: 'get',
      url: `${process.env.E_SERVICE_URL}/V2/userservices/ba`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const addBa = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
    });

    const config = {
      httpsAgent,
      method: 'post',
      url: `${process.env.E_SERVICE_URL}/V2/userservices/ba`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const removeBa = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
    });

    const config = {
      httpsAgent,
      method: 'put',
      url: `${process.env.E_SERVICE_URL}/V2/userservices/ba/del`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getMemberProfile = async (payload) => {
  try {
    const config = {
      httpsAgent,
      method: 'get',
      url: `${process.env.E_SERVICE_URL}/V2/users/profile/`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateMemberProfile = async (payload) => {
  try {
    const body = JSON.stringify({
      titlename: payload.titlename,
      firstname: payload.firstname,
      lastname: payload.lastname,
      mobile: payload.mobile,
      email: payload.email,
      password: payload.password,
      idnumbertype: payload.idnumbertype,
      idnumber: payload.idnumber,
      consent: payload.consent,
    });

    const config = {
      httpsAgent,
      method: 'put',
      url: `${process.env.E_SERVICE_URL}/V2/users/profile/`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const changeMemberPwd = async (payload) => {
  try {
    const body = JSON.stringify({
      current_password: payload.current_password,
      new_password: payload.new_password,
      confirm_password: payload.confirm_password,
    });

    const config = {
      httpsAgent,
      method: 'PATCH',
      url: `${process.env.E_SERVICE_URL}/V2/users/profile/changepwd`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const forgotPwd = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
      email: payload.email,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/users/forgotpwd/request`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const removeSocialLink = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
    });

    const config = {
      httpsAgent,
      method: 'PUT',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/del`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const socialLink = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: payload.socialtype,
      socialid: payload.socialid,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/link`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const payBill = async (payload) => {
  try {
    const body = JSON.stringify(payload);

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/payments/bill/line`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const payOtc = async (payload) => {
  try {
    const body = JSON.stringify(payload);

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/payments/otcpay`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const paymentDetails = async (payload) => {
  try {
    const body = JSON.stringify({
      transactionref: payload.transactionref,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/payments/detailpay`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const speedChange = async (payload) => {
  try {
    const body = JSON.stringify({
      serviceno: payload.serviceno,
      ba: payload.ba,
      original_speed: payload.original_speed,
      current_speed: payload.current_speed,
      new_speed: payload.new_speed,
      fttxuser: payload.fttxuser,
      groupnameOld: payload.groupnameOld,
      groupnameNew: payload.groupnameNew,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/services/togglespeed/change`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const speedCheck = async (payload) => {
  try {
    const body = JSON.stringify({
      serviceno: payload.serviceno,
      eservice_ref: payload.eservice_ref,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/services/togglespeed/check`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const speedNotify = async (payload) => {
  try {
    const body = JSON.stringify({
      eservice_ref: payload.eservice_ref,
      status: payload.status,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/services/togglespeed/notify`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const recommendedPackages = async (payload) => {
  try {
    const body = JSON.stringify({
      offer_id: payload.offer_id,
      offer_price: payload.offer_price,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/packages/recommended/`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getUpdateBaInfoNew = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      ebill_email: payload.ebill_email,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/ebill/updateBaInfo/new`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getUpdateBaInfoChange = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      ebill_email: payload.ebill_email,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/ebill/updateBaInfo/change`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getUpdateBaInfoCancel = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      change_addr: payload.change_addr,
      mobile_contact: payload.mobile_contact,
      homeno: payload.homeno,
      village: payload.village,
      moo: payload.moo,
      soi: payload.soi,
      road: payload.road,
      tambol: payload.tambol,
      amphur: payload.amphur,
      province: payload.province,
      zipcode: payload.zipcode,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/ebill/updateBaInfo/cancel`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const changeEmailInfo = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      contact_email: payload.contact_email,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/contact/contactBaInfo/email`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const changeContactInfo = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      contact_mobile: payload.contact_mobile,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/contact/contactBaInfo/contact`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const changeBillAddrInfo = async (payload) => {
  try {
    const body = JSON.stringify({
      ba: payload.ba,
      serviceno: payload.serviceno,
      servicetype: payload.servicetype,
      mobile_contact: payload.mobile_contact,
      homeno: payload.homeno,
      village: payload.village,
      moo: payload.moo,
      soi: payload.soi,
      road: payload.road,
      tambol: payload.tambol,
      amphur: payload.amphur,
      province: payload.province,
      zipcode: payload.zipcode,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/contact/contactBaInfo/billaddr`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateBillAlert = async (payload) => {
  try {
    const body = JSON.stringify({
      before_due: payload.before_due,
      after_due: payload.after_due,
    });

    const config = {
      httpsAgent,
      method: 'PUT',
      url: `${process.env.E_SERVICE_URL}/V2/userservices/ba/updateBillAlert`,
      headers: {
        'x-service-access': payload.service_access_token,
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const lineBlock = async (payload) => {
  try {
    const body = JSON.stringify({
      socialtype: 2,
      socialid: payload.socialid,
      scope: payload.scope,
    });

    const config = {
      httpsAgent,
      method: 'PUT',
      url: `${process.env.E_SERVICE_URL}/V2/users/social/block`,
      headers: {
        'x-clientip': payload['x-clientip'],
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const eServiceUserRemove = async (payload) => {
  try {
    const body = JSON.stringify({
      scope: payload.scope,
      socialtype: payload.socialtype,
      socialid: payload.socialid,
      clientid: payload.clientid,
    });

    const config = {
      httpsAgent,
      method: 'PUT',
      url: `${process.env.E_SERVICE_URL}/V2/developes/line/rmMb`,
      headers: {
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateMemberTier = async (payload) => {
  try {
    const body = JSON.stringify({
      idnumbertype: payload.idnumbertype,
      idnumber: payload.idnumber,
      email: payload.password,
      password: payload.password,
    });

    const config = {
      httpsAgent,
      method: 'PUT',
      url: `${process.env.E_SERVICE_URL}/V2/users/profile/tier`,
      headers: {
        'x-clientip': payload['x-clientip'],
        'x-service-access': payload.service_access_token,
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const eTaxDoc = async (payload) => {
  try {
    const body = JSON.stringify({
      receivenumber: payload.receivenumber,
      paymentdate: payload.paymentdate,
    });

    const config = {
      httpsAgent,
      method: 'POST',
      url: `${process.env.E_SERVICE_URL}/V2/payments/etaxdoc/`,
      headers: {
        'x-clientip': payload['x-clientip'],
        'x-service-access': payload.service_access_token,
        Authorization: `Bearer ${process.env.E_SERVICE_AUTHORIZATION_TOKEN_E_SERVICE}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
    };

    const { status, data } = await axios(config);

    return { status, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};
export default {
  lineFollow,
  signUpWithSocial,
  loginWithSocial,
  checkMobileMember,
  checkSocialMember,
  activateSocialMember,
  requestMemberToken,
  getBaLists,
  addBa,
  removeBa,
  getMemberProfile,
  updateMemberProfile,
  changeMemberPwd,
  forgotPwd,
  removeSocialLink,
  socialLink,
  payBill,
  payOtc,
  paymentDetails,
  speedChange,
  speedCheck,
  speedNotify,
  recommendedPackages,
  getUpdateBaInfoNew,
  getUpdateBaInfoChange,
  getUpdateBaInfoCancel,
  changeEmailInfo,
  changeContactInfo,
  changeBillAddrInfo,
  updateBillAlert,
  lineBlock,
  eServiceUserRemove,
  updateMemberTier,
  eTaxDoc,
};
