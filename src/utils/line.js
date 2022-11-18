import client from '../config/line.js';
import captureException from './captureException.js';
import logger from '../config/winston.js';

export const replyMessage = (replyToken, messages) => new Promise((resolve, reject) => {
  client.replyMessage(replyToken, messages)
    .then((result) => {
      resolve(result);
    }).catch((err) => {
      logger.error(err);
      captureException(messages);
      reject(err);
    });
});

export const pushMessage = (to, messages) => new Promise((resolve, reject) => {
  client.pushMessage(to, messages)
    .then((result) => {
      resolve(result);
    }).catch((err) => {
      logger.error(err);
      captureException(messages);
      reject(err);
    });
});

export const getProfile = (userId) => new Promise((resolve, reject) => {
  client.getProfile(userId)
    .then((profile) => {
      resolve(profile);
    }).catch((err) => {
      reject(err);
    });
});
