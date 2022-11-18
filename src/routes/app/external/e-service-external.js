import express from 'express';
import logger from '../../../config/winston.js';
import sentry from '../../../config/sentry.js';
import eServiceExternal from '../../../external/eService.js';
import { getIP, serviceAccessVerify } from '../../../middleware/middleware.js';
import { MasterRegister } from '../../../models/nt.model.js';
import { doubleBase64Encrypt } from '../../../utils/base64encrypt.js';

const router = express.Router();
/**
 * @swagger
 * /api/e-service-external/users/social/follow:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service lineFollow.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/UserTier1'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/social/follow', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.lineFollow(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/signup/line:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service signUpWithSocial.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            oneOf:
 *              - $ref: '#/components/requestBody/UserTier2'
 *              - $ref: '#/components/requestBody/UserTier3'
 *          examples:
 *            Tier2:
 *              value:
 *                socialtype: 1
 *                socialid: 'socialId'
 *                displayname: 'displayname'
 *                mobile: '0956412539'
 *                consent: '1'
 *            Tier3:
 *              value:
 *                socialtype: 1
 *                socialid: 'socialId'
 *                displayname: 'displayname'
 *                mobile: '0956412539'
 *                email: 'test@test.com'
 *                password: 'password'
 *                idnumbertype: 1
 *                idnumber: '0000000000'
 *                consent: '1'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/signup/line', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.signUpWithSocial(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/login:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service loginWithSocial.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            anyOf:
 *              - $ref: '#/components/requestBody/socialLogin'
 *              - $ref: '#/components/requestBody/emailLogin'
 *              - $ref: '#/components/requestBody/mobileLogin'
 *          examples:
 *            socialLogin:
 *              value:
 *                loginpage: 1
 *                type: 3
 *                socialtype: 2
 *                socialid: 'socialId'
 *            emailLogin:
 *              value:
 *                loginpage: 1
 *                type: 1
 *                email: 'test@test.com'
 *                password: 'password'
 *                socialtype: 2
 *                socialid: 'socialId'
 *            mobileLogin:
 *              value:
 *                loginpage: 1
 *                type: 2
 *                mobile: '0956412539'
 *                otp_token: '000000'
 *                socialtype: 2
 *                socialid: 'socialId'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/login', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.loginWithSocial(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/checkmobile:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service checkMobileMember.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/checkMobile'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/checkmobile', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.checkMobileMember(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/social/check:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service checkSocialMember.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/checkSocial'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/social/check', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.checkSocialMember(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/social/activate:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service activateSocialMember.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/socialActivate'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/social/activate', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.activateSocialMember(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/request/token:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service requestMemberToken.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/requestToken'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/request/token', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.requestMemberToken(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/userservices/ba:
 *  get:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service getBaLists.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/userservices/ba', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.getBaLists(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/userservices/ba:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service addBa.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/addBa'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/userservices/ba', async (req, res) => {
  try {
    const payload = req.body;
    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.addBa(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/userservices/ba/del:
 *  put:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service removeBa.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/removeBa'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/userservices/ba/del', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.removeBa(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/profile:
 *  get:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service getMemberProfile.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/users/profile', async (req, res) => {
  try {
    const payload = req.body;
    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.getMemberProfile(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/profile:
 *  put:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service updateMemberProfile.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/updateMemberProfile'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/users/profile', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.updateMemberProfile(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/profile/changepwd:
 *  patch:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service changeMemberPwd.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/changeMemberPwd'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.patch('/users/profile/changepwd', serviceAccessVerify, getIP, async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const formResult = await MasterRegister.findById(payload.form_id);

    payload.current_password = formResult.password;
    payload.new_password = doubleBase64Encrypt(payload.new_password);
    payload.confirm_password = doubleBase64Encrypt(payload.confirm_password);

    const result = await eServiceExternal.changeMemberPwd(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/forgotpwd/request:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service forgotPwd.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/forgotPwd'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/forgotpwd/request', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.forgotPwd(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/social/del:
 *  put:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service removeSocialLink.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/rmSocialLink'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put('/users/social/del', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.removeSocialLink(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/users/social/link:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service socialLink.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/socialLink'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/users/social/link', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.socialLink(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/payments/bill/line:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service payBill.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/payBill'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/payments/bill/line', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.payBill(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/payments/otc:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service payOtc.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/paymentOtc'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/payments/otc', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.payOtc(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/payments/detailpay:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service paymentDetails.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/paymentDetail'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/payments/detailpay', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.paymentDetails(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/services/togglespeed/change:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service speedChange.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/speedChange'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/services/togglespeed/change', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.speedChange(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/services/togglespeed/check:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service speedCheck.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/speedCheck'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/services/togglespeed/check', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.speedCheck(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/services/togglespeed/notify:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service speedNotify.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/speedNotify'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/services/togglespeed/notify', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.speedNotify(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/packages/recommended:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service recommendedPackages.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/recommendedPackages'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/packages/recommended', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.recommendedPackages(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/ebill/updateBaInfo/new:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service getUpdateBaInfoNew.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/BaInfoNew'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/ebill/updateBaInfo/new', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.getUpdateBaInfoNew(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/ebill/updateBaInfo/change:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service getUpdateBaInfoChange.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/BaInfoChange'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/ebill/updateBaInfo/change', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.getUpdateBaInfoChange(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
 * @swagger
 * /api/e-service-external/ebill/updateBaInfo/cancel:
 *  post:
 *    tags: ["External e-Service"]
 *    description: APP External e-Service getUpdateBaInfoCancel.
 *    parameters:
 *     - in: header
 *       name: x-clientip
 *       schema:
 *          type: string
 *          format: x-clientip
 *       required: true
 *     - in: header
 *       name: x-service-access
 *       schema:
 *          type: string
 *          format: x-service-access
 *       required: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/requestBody/BaInfoCancel'
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/ebill/updateBaInfo/cancel', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.getUpdateBaInfoCancel(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
* @swagger
* /api/e-service-external/contact/contactBaInfo/email:
*  post:
*    tags: ["External e-Service"]
*    description: APP External e-Service changeEmailInfo.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/changeEmailInfo'
*    responses:
*      '200':
*        description: A successful response
*/
router.post('/contact/contactBaInfo/email', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.changeEmailInfo(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
* @swagger
* /api/e-service-external/contact/contactBaInfo/contact:
*  post:
*    tags: ["External e-Service"]
*    description: APP External e-Service changeContactInfo.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/changeContactInfo'
*    responses:
*      '200':
*        description: A successful response
*/
router.post('/contact/contactBaInfo/contact', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.changeContactInfo(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});
/**
* @swagger
* /api/e-service-external/contact/contactBaInfo/billaddr:
*  post:
*    tags: ["External e-Service"]
*    description: APP External e-Service changeBillAddrInfo.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/changeBillAddress'
*    responses:
*      '200':
*        description: A successful response
*/
router.post('/contact/contactBaInfo/billaddr', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.changeBillAddrInfo(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

/**
* @swagger
* /api/e-service-external/users/social/block:
*  put:
*    tags: ["External e-Service"]
*    description: APP External e-Service สำหรับ block line.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/LineBlock'
*    responses:
*      '200':
*        description: A successful response
*/
router.put('/users/social/block', async (req, res) => {
  try {
    const payload = req.body;

    payload['x-clientip'] = req.ip;

    const result = await eServiceExternal.lineBlock(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

/**
* @swagger
* /api/e-service-external/userservices/ba/updateBillAlert:
*  put:
*    tags: ["External e-Service"]
*    description: APP External e-Service สำหรับ update bill alert.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/UpdateBillAlert'
*    responses:
*      '200':
*        description: A successful response
*/
router.put('/userservices/ba/updateBillAlert', async (req, res) => {
  try {
    const payload = req.body;

    const serviceAccessToken = req.headers['x-service-access'];

    payload['x-clientip'] = req.ip;
    payload.service_access_token = serviceAccessToken;

    const result = await eServiceExternal.updateBillAlert(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

/**
* @swagger
* /api/e-service-external/users/remove:
*  put:
*    tags: ["External e-Service"]
*    description: APP External e-Service สำหรับ remove user e-Service.
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/RemoveLineUser'
*    responses:
*      '200':
*        description: A successful response
*/
router.put('/users/remove', async (req, res) => {
  try {
    const payload = req.body;
    const result = await eServiceExternal.eServiceUserRemove(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

/**
* @swagger
* /api/e-service-external/payments/etaxdoc/:
*  post:
*    tags: ["External e-Service"]
*    description: APP External e-Service สำหรับเรียกดู e-tax / e-receive.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/eTax'
*    responses:
*      '200':
*        description: A successful response
*/
router.post('/users/profile/tier', async (req, res) => {
  try {
    const payload = req.body;
    const result = await eServiceExternal.updateMemberTier(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

/**
* @swagger
* /api/e-service-external/users/profile/tier:
*  put:
*    tags: ["External e-Service"]
*    description: APP External e-Service สำหรับปรับปรุงข้อมูลเพิ่มระดับสมาชิก.
*    parameters:
*     - in: header
*       name: x-clientip
*       schema:
*          type: string
*          format: x-clientip
*       required: true
*     - in: header
*       name: x-service-access
*       schema:
*          type: string
*          format: x-service-access
*       required: true
*    requestBody:
*      content:
*        application/json:
*          schema:
*            $ref: '#/components/requestBody/updateMemberTier'
*    responses:
*      '200':
*        description: A successful response
*/
router.put('/users/profile/tier', async (req, res) => {
  try {
    const payload = req.body;
    const result = await eServiceExternal.updateMemberTier(payload);
    res.status(200).json({ status: 200, message: 'Succesfully', data: result });
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
    res.status(status).json({ status, message: err.message, data });
  }
});

export default router;

/**
* @swagger
* components:
*   requestBody:
*     UserTier1:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: Social Type ID 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'P@sslinedev'
*           description: Password
*         displayname:
*           type: string
*           example: 'displayname'
*           description: Line user display name
*         subscribe:
*           type: string
*           required: true
*           example: "1"
*           description: 1 = Follow , 2 = Unfollow
*     UserTier2:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: Social Type ID 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'P@sslinedev'
*           description: Password
*         displayname:
*           type: string
*           example: 'displayname'
*           description: Line user display name
*         mobile:
*           type: string
*           required: true
*           example: '0956412539'
*           description: User Telephone number
*         consent:
*           type: string
*           required: true
*           example: '1'
*           description: 1 = Accept, 2 = No Accept
*     UserTier3:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: Social Type ID 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'P@sslinedev'
*           description: Password
*         displayname:
*           type: string
*           example: 'displayname'
*           description: Line user display name
*         mobile:
*           type: string
*           required: true
*           example: '0956412539'
*           description: User Telephone number
*         email:
*           type: string
*           example: 'test@test.com'
*           description: User email
*         password:
*           type: string
*           example: '0956412539'
*           description: User Telephone number
*         idnumbertype:
*           type: integer
*           required: true
*           example: 1
*           description: User citizen type
*         idnumber:
*           type: string
*           required: true
*           example: '0000000000000'
*           description: User citizen number
*         consent:
*           type: string
*           required: true
*           example: '1'
*           description: 1 = Accept, 2 = No Accept
*     socialLogin:
*       type: object
*       properties:
*         loginpage:
*           type: integer
*           required: true
*           example: 1
*           description: 1 only
*         type:
*           type: integer
*           required: true
*           example: 3
*           description: 3 only
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'P@sslinedev'
*           description: Password
*     emailLogin:
*       type: object
*       properties:
*         loginpage:
*           type: integer
*           required: true
*           example: 1
*           description: 1 only
*         type:
*           type: integer
*           required: true
*           example: 1
*           description: 1 only
*         email:
*           type: string
*           required: true
*           example: 'test@test.com'
*           description: Email
*         password:
*           type: string
*           required: true
*           example: 'P@sslinedev'
*           description: Password
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*     mobileLogin:
*       type: object
*       properties:
*         loginpage:
*           type: integer
*           required: true
*           example: 1
*           description: 1 only
*         type:
*           type: integer
*           required: true
*           example: 1
*           description: 2 only
*         mobile:
*           type: string
*           required: true
*           example: '0956412539'
*           description: User telephone number
*         otp_token:
*           type: string
*           required: true
*           example: '000000'
*           description: OIP number from API CheckMobileMember
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 Only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*     checkMobile:
*       type: object
*       properties:
*         mobile:
*           type: string
*           example: '0956412539'
*           required: true
*           description: User's telephone number
*     checkSocial:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           example: 2
*           required: true
*           description: 2 only
*         socialid:
*           type: string
*           example: 'socialid'
*           required: true
*           description: Social ID
*     socialActivate:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           example: 2
*           required: true
*           description: 2 only
*         socialid:
*           type: string
*           example: 'socialid'
*           required: true
*           description: Social ID
*         activate:
*           type: integer
*           example: 1
*           required: true
*           description: 1 = Activate, 2 = InActivate
*     requestToken:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           example: 2
*           required: true
*           description: 2 only
*         socialid:
*           type: string
*           example: 'socialid'
*           required: true
*           description: Social ID
*         refresh_token:
*           type: string
*           example: "token"
*           required: true
*           description:
*     addBa:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: '0000000'
*           required: true
*           description:
*         serviceno:
*           type: string
*           example: '123456'
*           required: true
*           description:
*     removeBa:
*       type: object
*       properties:
*         servicetype:
*           type: string
*           example: '1'
*           required: true
*           description: 1 = Fixedline , 2 = Mobile
*         ba:
*           type: string
*           example: '0000000'
*           required: true
*           description:
*         serviceno:
*           type: string
*           example: '123456'
*           required: true
*           description:
*     updateMemberProfile:
*       type: object
*       properties:
*         titlename:
*           type: string
*           example: 'นาย'
*           description:
*         firstname:
*           type: string
*           example: 'firstname'
*           description:
*         lastname:
*           type: string
*           example: 'lastname'
*           description:
*         mobile:
*           type: string
*           example: '0956412539'
*           description:
*         email:
*           type: string
*           example: 'test@test.com'
*           description:
*         password:
*           type: string
*           example: '1234567890'
*           description:
*         idnumbertype:
*           type: string
*           example: '1'
*           description:
*         idnumber:
*           type: string
*           example: '0000000000000'
*           description:
*         consent:
*           type: string
*           example: '1,2,3'
*           description:
*     changeMemberPwd:
*       type: object
*       properties:
*         current_password:
*           type: string
*           example: '1234567890'
*           description:
*         new_password:
*           type: string
*           example: 'p@ssWorD'
*           description:
*         confirm_password:
*           type: string
*           example: 'p@ssWorD'
*           description:
*     forgotPwd:
*       type: object
*       properties:
*         email:
*           type: string
*           required: true
*           example: 'test@test.com'
*           description:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*     rmSocialLink:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*     socialLink:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*     payBill:
*       type: object
*       properties:
*         x-clientip:
*           type: string
*           required: true
*           example: "171.6.234.73"
*           description: clientip
*         service_app_code:
*           type: string
*           required: true
*           example: '2dd219399619e37fca686ffe65421aa2295420193a351e84fd61510560f7d338'
*           description:  This value '2dd219399619e37fca686ffe65421aa2295420193a351e84fd61510560f7d338' only
*         requestid:
*           type: string
*           required: true
*           example: 'requestid'
*           description:
*         balists:
*           type: array
*           required: true
*           example:
*             - ba: '00001'
*             - ba: '00002'
*           description:
*     paymentOtc:
*       type: object
*       properties:
*         x-clientip:
*           type: string
*           required: true
*           example: "171.6.234.73"
*           description: clientip
*         ex_tranref:
*           type: string
*           required: true
*           example: 'ex_tranref'
*           description:
*         order_items:
*           type: array
*           required: true
*           items:
*             type: object
*             properties:
*               product_code:
*                 type: string
*                 example: '00001'
*               product_id:
*                 type: string
*                 example: '00001'
*               product_title:
*                 type: string
*                 example: 'Product01'
*               product_model:
*                 type: string
*                 example: 'XXX00'
*               product_unit:
*                 type: number
*                 example: 5
*               product_price:
*                 type: number
*                 multipleOf: 0.01
*                 example: 25.75
*               product_vat:
*                 type: number
*                 multipleOf: 0.01
*                 example: 1.80
*               product_price_net:
*                 type: number
*                 multipleOf: 0.01
*                 example: 25.75
*               product_vat_net:
*                 type: number
*                 multipleOf: 0.01
*                 example: 27.55
*           description:
*         total_unit:
*           type: number
*           required: true
*           example: 5
*           description: Amount product sum
*         total_price:
*           type: integer
*           multipleOf: 0.01
*           required: true
*           example: 25.75
*           description: Price sum (Not include VAT)
*         total_price_vat:
*           type: integer
*           required: true
*           multipleOf: 0.01
*           example: 1.80
*           description: VAT Sum
*         total_payment:
*           type: integer
*           required: true
*           multipleOf: 0.01
*           example: 27.55
*           description: Price sum (VAT included)
*         fisrtname:
*           type: string
*           required: true
*           example: 'firstname'
*         lastname:
*           type: string
*           required: true
*           example: 'lastname'
*         email:
*           type: string
*           required: true
*           example: 'test@test.com'
*         contact_phone:
*           type: string
*           required: true
*           example: '0956412539'
*         house_no:
*           type: string
*           required: true
*           example: '123/45'
*         village:
*           type: string
*           example: ''
*         village_no:
*           type: string
*           example: ''
*         soi:
*           type: string
*           example: '10'
*         road:
*           type: string
*           example: ''
*         subdistrict:
*           type: string
*           required: true
*           example: 'ในเมือง'
*         district:
*           type: string
*           required: true
*           example: 'เมือง'
*         province:
*           type: string
*           required: true
*           example: 'พิษณุโลก'
*         zipcode:
*           type: number
*           required: true
*           example: 65000
*         home_location:
*           type: string
*           required: true
*           example: '000/00'
*         tax_id_type:
*           type: string
*           required: true
*           example: 'TXID'
*         national_id:
*           type: string
*           required: true
*           example: '0000000000000'
*           description: Citizen or passport ID
*         business_id:
*           type: string
*           required: true
*           example: '0000000'
*         branch_id:
*           type: string
*           required: true
*           example: '00000'
*         company_name:
*           type: string
*           required: true
*           example: 'companyName'
*         document_type_code:
*           type: string
*           required: true
*           example: 'T05'
*     paymentDetail:
*       type: object
*       properties:
*         receiptno:
*           type: string
*           example: '00000011234'
*           required: true
*     speedChange:
*       type: object
*       properties:
*         service_no:
*           type: string
*           required: true
*           example: '7521J0236'
*         ba:
*           type: string
*           required: true
*           example: '000043'
*         original_speed:
*           type: array
*           required: true
*           items:
*             type: object
*             properties:
*               download:
*                 type: string
*               upload:
*                 type: string
*             example:
*               - download: '250'
*                 upload: '100'
*               - download: '400'
*                 upload: '400'
*         current_speed:
*           type: array
*           required: true
*           items:
*             type: object
*             properties:
*               download:
*                 type: string
*               upload:
*                 type: string
*             example:
*               - download: '400'
*                 upload: '100'
*               - download: '300'
*                 upload: '200'
*         new_speed:
*           type: array
*           required: true
*           items:
*             type: object
*             properties:
*               download:
*                 type: string
*               upload:
*                 type: string
*             example:
*               - download: '100'
*                 upload: '400'
*               - download: '100'
*                 upload: '700'
*         fftx_user:
*           type: string
*           required: true
*           example: '7521J0236@fttxhome'
*         groupnameOld:
*           type: string
*           required: true
*           example: ''
*           description: groupname from API SpeedCheck
*         groupnameNew:
*           type: string
*           required: true
*           example: 'fttxhome100m400m'
*     speedCheck:
*       type: object
*       properties:
*         serviceno:
*           type: string
*           example: '7521J0236'
*           required: true
*         eservice_ref:
*           type: string
*           example: 'TS221000157'
*           required: true
*     speedNotify:
*       type: object
*       properties:
*         eservice_ref:
*           type: string
*           example: 'TS221000157'
*           required: true
*         status:
*           type: string
*           example: 'success'
*           required: true
*           description: success/fail
*     recommendedPackages:
*       type: object
*       properties:
*         offer_id:
*           type: string
*           example: 'offer_id'
*           required: true
*         offer_price:
*           type: string
*           example: '100'
*           required: true
*     BaInfoNew:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: '0000564'
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*           description: success/fail
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         ebill_emaill:
*           type: string
*           example: 'test@test.com'
*           required: true
*     BaInfoChange:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: '0000564'
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         ebill_emaill:
*           type: string
*           example: 'test@test.com'
*           required: true
*     BaInfoCancel:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: '0000564'
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         change_addr:
*           type: string
*           example: 'Y'
*           required: true
*           description: Y/N, If Y address&mobile contact will validate
*         mobile_contact:
*           type: string
*           example: '0956412539'
*           required: true
*         homeno:
*           type: string
*           example: '123/45'
*           required: true
*         village:
*           type: string
*           example: '1'
*         moo:
*           type: string
*           example: '10'
*         soi:
*           type: string
*           example: '10'
*         road:
*           type: string
*           example: 'road 10'
*         tambol:
*           type: string
*           example: 'ในเมือง'
*           required: true
*         amphur:
*           type: string
*           example: 'เมือง'
*           required: true
*         province:
*           type: string
*           example: 'พิษณุโลก'
*           required: true
*         zipcode:
*           type: string
*           example: '65000'
*           required: true
*     changeEmailInfo:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: ''
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         contact_emaill:
*           type: string
*           example: 'test@test.com'
*           required: true
*     changeContactInfo:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: ''
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         contact_mobile:
*           type: string
*           example: '0956412538'
*           required: true
*     changeBillAddress:
*       type: object
*       properties:
*         ba:
*           type: string
*           example: ''
*           required: true
*         serviceno:
*           type: string
*           example: ''
*           required: true
*         servicetype:
*           type: string
*           example: 'fixedlind'
*           required: true
*           description: fixedlind,mobile only
*         mobile_contact:
*           type: string
*           example: '0956412538'
*           required: true
*         homeno:
*           type: string
*           example: '123/45'
*           required: true
*         village:
*           type: string
*           example: '1'
*         moo:
*           type: string
*           example: '10'
*         soi:
*           type: string
*           example: '10'
*         road:
*           type: string
*           example: 'road 10'
*         tambol:
*           type: string
*           example: 'ในเมือง'
*           required: true
*         amphur:
*           type: string
*           example: 'เมือง'
*           required: true
*         province:
*           type: string
*           example: 'พิษณุโลก'
*           required: true
*         zipcode:
*           type: string
*           example: '65000'
*           required: true
*     LineBlock:
*       type: object
*       properties:
*         socialtype:
*           type: integer
*           required: true
*           example: 2
*           description: 2 only
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*         scope:
*           type: string
*           required: true
*           example: 'block'
*           description: block/unblock
*     RemoveLineUser:
*       type: object
*       properties:
*         scope:
*           type: string
*           required: true
*           example: 'active'
*           description: active
*         socialtype:
*           type: string
*           required: true
*           example: '2'
*           description: '2'
*         socialid:
*           type: string
*           required: true
*           example: 'socialid'
*           description:
*         clientid:
*           type: string
*           required: true
*           example: ''
*           description: ''
*     UpdateBillAlert:
*       type: object
*       properties:
*         before_due:
*           type: integer
*           required: true
*           example: 1
*           description: 0 = ไม่รับ,1 = รับ
*         after_due:
*           type: integer
*           required: true
*           example: 1
*           description: 0 = ไม่รับ,1 = รับ
*     updateMemberTier:
*       type: object
*       properties:
*         email:
*           type: string
*           example: 'test@test.com'
*           description: double base64 is required!
*         password:
*           type: string
*           example: '1234567890'
*           description: double base64 is required!
*         idnumbertype:
*           type: string
*           example: '1'
*           description: 1 = CitizenID, 2 = Passport
*         idnumber:
*           type: string
*           example: '0000000000000'
*           description: double base64 is required!
*     eTax:
*       type: object
*       properties:
*         receivenumber:
*           type: string
*           example: ''
*           required: true
*           description:
*         paymentdate:
*           type: string
*           example: ''
*           required: true
*           description:
*/
