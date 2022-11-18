import Client from 'ssh2-sftp-client';
import moment from 'moment-timezone';
import sentry from '../config/sentry.js';
import logger from '../config/winston.js';
import lineNotifyService from '../services/lineNotify.service.js';
import { doubleBase64Decrypt, doubleBase64Encrypt } from '../utils/base64encrypt.js';
import { pushMessage, getProfile } from '../utils/line.js';
import { MasterLineUser } from '../models/line.model.js';
import { MasterRegister } from '../models/nt.model.js';
import eServiceExternal from '../external/eService.js';
import cmsExternal from '../external/cms.js';

const createTransactionLineNotifies = async (payload) => {
  try {
    await lineNotifyService.createTransactionLineNotifies({
      account_no: payload[0],
      name: payload[1],
      amount: payload[2],
      min_due: payload[3],
      max_due: payload[4],
      service_no: payload[5],
      off_fuse_date: payload[6],
      flag: '0',
    });
    return { status: 200, message: 'Success' };
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    return { status: 400, message: err.message };
  }
};

const createManyTransactionLineNotifies = async (payload) => {
  try {
    await lineNotifyService.createManyTransactionLineNotifies(payload);

    return { status: 200, message: 'Success' };
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);

    return { status: 400, message: err.message };
  }
};

const createTransactionHistoryFileLineNotifies = async (payload) => {
  try {
    await lineNotifyService.createTransactionHistoryFileLineNotifies(payload);
    return { status: 200, message: 'Success' };
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const findTransactionHistoryFileLineNotifies = async (payload) => {
  try {
    const result = lineNotifyService.findTransactionHistoryFileLineNotifies(payload);
    return result;
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const getTransactionLineNotifies = async () => {
  try {
    const result = lineNotifyService.getTransactionLineNotifies();
    return result;
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const updateTransactionLineNotifies = async (filter, payload) => {
  try {
    const result = lineNotifyService.updateTransactionLineNotifies(filter, payload);
    return result;
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const cronGetLineNotifiesBeforeDue = async () => {
  try {
    // const config = {
    //   host: '159.65.12.111',
    //   port: '22',
    //   username: 'root',
    //   password: 'yellowidea1!',
    //   tryKeyboard: true,
    // };
    // host: 159.65.12.111 user: root pass: yellowidea1!
    // const sftp = new Client();
    // sftp.connect(config).then(() => sftp.list('/home')).then((data) => {
    //   console.log(data, 'the data info');
    // }).catch((err) => {
    //   console.log(err, 'catch error');
    // });
    // const Client = require('ssh2-sftp-client');
    // const remoteFile = '/home/billalert_line/data';
    // const remoteFile = '/home';
    // const sftp = new Client();

    // sftp.connect(config).then(() => sftp.list(remoteFile)).then((data) => {
    //   console.log(data, 'the data info');
    // }).catch((err) => {
    //   console.log(err, 'catch error');
    // });

    const config = {
      host: '203.113.1.183',
      port: '22',
      username: 'yilineadmin',
      password: 'YI4@b1llsftp;',
    };

    const sftp = new Client();
    const remotePath = '/home/billalert_line/data/';
    const filename = 'before_due_';
    const datenow = moment.tz(new Date(), 'Asia/Bangkok').format('DDMMYYYY');
    const remoteFile = `${remotePath + filename + datenow}.txt`;

    sftp.connect(config).then(() => sftp.list('/home/billalert_line/data')).then((data) => {
      console.log(data, 'the data info');
    }).catch((err) => {
      console.log(err, 'catch error');
    });

    const isExist = await lineNotifyService.findTransactionHistoryFileLineNotifies({ filename: remoteFile });

    if (!isExist) {
      sftp.connect(config).then(() => sftp.get(remoteFile).then((data) => {
        const dataSplitLine = data.toString().split('\r\n');
        const rowPerTimes = 1000;
        let rowNo = 1;
        let arrayInsert = [];
        dataSplitLine.forEach((element, index) => {
          if (index > 0) {
            if (rowNo < rowPerTimes) {
              const dataSplit = element.split('|');
              arrayInsert.push({
                account_no: dataSplit[0],
                name: dataSplit[1],
                amount: dataSplit[2],
                min_due_date: dataSplit[3],
                max_due_date: dataSplit[4],
                service_no: dataSplit[5],
                location_code: dataSplit[6],
                ref: doubleBase64Decrypt(String(dataSplit[7])),
                type: 'before_due',
                flag: '0',
              });
              rowNo += 1;
            } else {
              lineNotifyService.createManyTransactionLineNotifies(arrayInsert);
              rowNo = 1;
              arrayInsert = [];
              const dataSplit = element.split('|');
              arrayInsert.push({
                account_no: dataSplit[0],
                name: dataSplit[1],
                amount: dataSplit[2],
                min_due_date: dataSplit[3],
                max_due_date: dataSplit[4],
                service_no: dataSplit[5],
                location_code: dataSplit[6],
                ref: doubleBase64Decrypt(dataSplit[7]),
                type: 'before_due',
                flag: '0',
              });
            }
          }
        });

        if (arrayInsert.length > 0 && rowNo > 0) {
          lineNotifyService.createManyTransactionLineNotifies(arrayInsert);
        }

        lineNotifyService.createTransactionHistoryFileLineNotifies({
          filename: remoteFile,
          total: dataSplitLine.length - 1,
        });
      })).catch((err) => {
        logger.error(err);
      });
    } else {
      return 'This file has been read.';
    }

    return 'error';
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const cronGetLineNotifiesAfterDue = async () => {
  try {
    // const config = {
    //   host: '159.65.12.111',
    //   port: '22',
    //   username: 'root',
    //   password: 'yellowidea1!',
    //   tryKeyboard: true,
    // };
    // host: 159.65.12.111 user: root pass: yellowidea1!
    // const sftp = new Client();
    // sftp.connect(config).then(() => sftp.list('/home')).then((data) => {
    //   console.log(data, 'the data info');
    // }).catch((err) => {
    //   console.log(err, 'catch error');
    // });
    // const Client = require('ssh2-sftp-client');
    // const remoteFile = '/home/billalert_line/data';
    // const remoteFile = '/home';
    // const sftp = new Client();

    const config = {
      host: '203.113.1.183',
      port: '22',
      username: 'yilineadmin',
      password: 'YI4@b1llsftp;',
    };

    const sftp = new Client();
    const remotePath = '/home/billalert_line/data/';
    const filename = 'after_due_';
    const datenow = moment.tz(new Date(), 'Asia/Bangkok').format('DDMMYYYY');
    const remoteFile = `${remotePath + filename + datenow}.txt`;

    sftp.connect(config).then(() => sftp.list('/home/billalert_line/data')).then((data) => {
      console.log(data, 'the data info');
    }).catch((err) => {
      console.log(err, 'catch error');
    });

    const isExist = await lineNotifyService.findTransactionHistoryFileLineNotifies({ filename: remoteFile });

    if (!isExist) {
      sftp.connect(config).then(() => sftp.get(remoteFile).then((data) => {
        const dataSplitLine = data.toString().split('\r\n');
        const rowPerTimes = 1000;
        let rowNo = 1;
        let arrayInsert = [];
        dataSplitLine.forEach((element, index) => {
          if (index > 0) {
            if (rowNo < rowPerTimes) {
              const dataSplit = element.split('|');
              arrayInsert.push({
                account_no: dataSplit[0],
                name: dataSplit[1],
                amount: dataSplit[2],
                min_due_date: dataSplit[3],
                max_due_date: dataSplit[4],
                service_no: dataSplit[5],
                location_code: dataSplit[6],
                ref: doubleBase64Decrypt(String(dataSplit[7])),
                type: 'after_due',
                flag: '0',
                off_fuse_date: dataSplit[8],
              });
              rowNo += 1;
            } else {
              lineNotifyService.createManyTransactionLineNotifies(arrayInsert);
              rowNo = 1;
              arrayInsert = [];
              const dataSplit = element.split('|');
              arrayInsert.push({
                account_no: dataSplit[0],
                name: dataSplit[1],
                amount: dataSplit[2],
                min_due_date: dataSplit[3],
                max_due_date: dataSplit[4],
                service_no: dataSplit[5],
                location_code: dataSplit[6],
                ref: doubleBase64Decrypt(dataSplit[7]),
                type: 'after_due',
                flag: '0',
                off_fuse_date: dataSplit[8],
              });
            }
          }
        });

        if (arrayInsert.length > 0 && rowNo > 0) {
          lineNotifyService.createManyTransactionLineNotifies(arrayInsert);
        }

        lineNotifyService.createTransactionHistoryFileLineNotifies({
          filename: remoteFile,
          total: dataSplitLine.length - 1,
        });
      })).catch((err) => {
        logger.error(err);
      });
    } else {
      return 'This file has been read.';
    }

    return 'error';
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const cronSendMessageLineNotifiesBeforeDue = async () => {
  try {
    const Transactions = await lineNotifyService.getTransactionLineNotifiesBeforeDue();
    const arrayUpdate = [];
    Transactions.forEach((element) => {
      const d = new Date(element.max_due_date);
      const monthNo = (d.getMonth());
      const monthname = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

      const fullDate = `${monthname[monthNo]} ${d.getFullYear() + 543}`;
      const maxDueDate = new Date(element.max_due_date);

      pushMessage(element.ref, [
        {
          type: 'flex',
          altText: 'ใบบันทึกรายการ',
          contents: {
            type: 'carousel',
            contents: [
              {
                type: 'bubble',
                size: 'mega',
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Frame-4444.png?w=1040`,
                      size: 'full',
                      align: 'end',
                      gravity: 'top',
                      aspectRatio: '293:64',
                      aspectMode: 'cover',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: 'รายการค่าบริการ',
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                        },
                      ],
                      margin: 'lg',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${element.name}`,
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                          adjustMode: 'shrink-to-fit',
                        },
                      ],
                      margin: 'lg',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `หมายเลขบริการ ${element.service_no}`,
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                          adjustMode: 'shrink-to-fit',
                        },
                      ],
                      margin: 'sm',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'รอบบิล',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${fullDate}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'เลขที่ใบแจ้ง',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${element.account_no}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'กำหนดชำระ',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${moment(maxDueDate).add(543, 'years').format('DD/MM/YYYY')}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'ยอดชำระ',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${element.amount} บาท`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                              color: '#003294',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'มียอดค่าใช้บริการทั้งสิ้น',
                              size: '14px',
                              weight: 'bold',
                              flex: 5,
                              adjustMode: 'shrink-to-fit',
                            },
                            {
                              type: 'text',
                              text: `${element.amount}`,
                              size: 'md',
                              align: 'end',
                              weight: 'bold',
                              flex: 3,
                              color: '#003294',
                              gravity: 'center',
                            },
                            {
                              type: 'text',
                              text: 'บาท',
                              size: 'xs',
                              align: 'end',
                              weight: 'bold',
                              color: '#003294',
                              gravity: 'center',
                            },
                          ],
                          margin: 'xl',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'separator',
                          margin: 'md',
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: '*ขออภัยหากท่านชำระแล้ว',
                              size: '14px',
                              weight: 'regular',
                              color: '#BBBBBB',
                              wrap: true,
                              margin: 'md',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                      ],
                      paddingAll: '0px',
                    },
                  ],
                  paddingAll: '0px',
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: 'จ่ายบิล',
                        uri: 'https://line.me/R/nv/location/',
                        altUri: {
                          desktop: 'https://line.me/R/nv/location/',
                        },
                      },
                      style: 'secondary',
                      color: '#FFD100',
                      height: 'sm',
                      margin: 'md',
                    },
                  ],
                  margin: 'lg',
                },
              },
            ],
          },
        },
      ]);
      arrayUpdate.push(element._id);
    });
    await lineNotifyService.updateTransactionLineNotifies({ _id: { $in: arrayUpdate } }, { $set: { flag: '1' } });
    return 'success';
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const cronSendMessageLineNotifiesAfterDue = async () => {
  try {
    const Transactions = await lineNotifyService.getTransactionLineNotifiesAfterDue();
    const arrayUpdate = [];
    Transactions.forEach((element) => {
      const d = new Date(element.max_due_date);
      const monthNo = (d.getMonth());
      const monthname = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

      const fullDate = `${monthname[monthNo]} ${d.getFullYear() + 543}`;
      const maxDueDate = new Date(element.max_due_date);
      const offFuseDate = new Date(element.off_fuse_date);
      // console.log(moment(maxDueDate).add(543, 'years').format('MM/DD/YYYY'));

      pushMessage(element.ref, [
        {
          type: 'flex',
          altText: 'ใบบันทึกรายการ',
          contents: {
            type: 'carousel',
            contents: [
              {
                type: 'bubble',
                size: 'mega',
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Frame-4444.png?w=1040`,
                      size: 'full',
                      align: 'end',
                      gravity: 'top',
                      aspectRatio: '293:64',
                      aspectMode: 'cover',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: 'รายการค่าบริการ',
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                        },
                      ],
                      margin: 'lg',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${element.name}`,
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                          adjustMode: 'shrink-to-fit',
                        },
                      ],
                      margin: 'lg',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `หมายเลขบริการ ${element.service_no}`,
                          size: '14px',
                          weight: 'bold',
                          color: '#222222',
                          adjustMode: 'shrink-to-fit',
                        },
                      ],
                      margin: 'sm',
                      paddingStart: 'xl',
                      paddingEnd: 'xl',
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'รอบบิล',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${fullDate}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'เลขที่ใบแจ้ง',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${element.account_no}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'กำหนดชำระ',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${moment(maxDueDate).add(543, 'years').format('DD/MM/YYYY')}`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'ยอดชำระ',
                              size: '14px',
                              offsetStart: 'xxl',
                            },
                            {
                              type: 'text',
                              text: `${element.amount} บาท`,
                              size: '14px',
                              align: 'end',
                              weight: 'bold',
                              color: '#003294',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            {
                              type: 'text',
                              text: 'มียอดค่าใช้บริการทั้งสิ้น',
                              size: '14px',
                              weight: 'bold',
                              flex: 5,
                              adjustMode: 'shrink-to-fit',
                            },
                            {
                              type: 'text',
                              text: `${element.amount}`,
                              size: 'md',
                              align: 'end',
                              weight: 'bold',
                              flex: 3,
                              color: '#003294',
                              gravity: 'center',
                            },
                            {
                              type: 'text',
                              text: 'บาท',
                              size: 'xs',
                              align: 'end',
                              weight: 'bold',
                              color: '#003294',
                              gravity: 'center',
                            },
                          ],
                          margin: 'xl',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                        {
                          type: 'separator',
                          margin: 'md',
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              text: `*หมายเลขบริการ ${element.service_no} จะใช้บริการได้ถึง  ${moment(offFuseDate).add(543, 'years').format('DD/MM/YYYY')} กรุณาชำระค่าบริการทั้งหมดเพื่อ ใช้งานได้อย่างต่อเนื่อง`,
                              size: '14px',
                              weight: 'regular',
                              color: '#BBBBBB',
                              wrap: true,
                            },
                            {
                              type: 'text',
                              text: '*ขออภัยหากท่านชำระแล้ว',
                              size: '14px',
                              weight: 'regular',
                              color: '#BBBBBB',
                              wrap: true,
                              margin: 'md',
                            },
                          ],
                          margin: 'lg',
                          paddingStart: 'xl',
                          paddingEnd: 'xl',
                        },
                      ],
                      paddingAll: '0px',
                    },
                  ],
                  paddingAll: '0px',
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'uri',
                        label: 'จ่ายบิล',
                        uri: 'https://line.me/R/nv/location/',
                        altUri: {
                          desktop: 'https://line.me/R/nv/location/',
                        },
                      },
                      style: 'secondary',
                      color: '#FFD100',
                      height: 'sm',
                      margin: 'md',
                    },
                  ],
                  margin: 'lg',
                },
              },
            ],
          },
        },
      ]);
      arrayUpdate.push(element._id);
    });
    await lineNotifyService.updateTransactionLineNotifies({ _id: { $in: arrayUpdate } }, { $set: { flag: '1' } });
    return 'success';
  } catch (err) {
    logger.error(err);
    sentry.captureException(err);
    return { status: 400, message: err.message };
  }
};

const sendFollow = async (mid) => {
  try {
    const lineProfile = await getProfile(mid);

    await MasterLineUser.create({
      line_user_id: mid,
      line_display_name: lineProfile.displayName,
      line_display_img: lineProfile.pictureUrl,
      is_follow: true,
    });

    const countMasterRegister = await MasterRegister.countDocuments({ line_user_id: mid });

    if (!countMasterRegister) {
      MasterRegister.create({
        line_user_id: mid,
        displayname: lineProfile.displayName,
      });
    }

    return Promise.all([
      eServiceExternal.lineFollow({
        'x-clientip': '0.0.0.0',
        socialtype: 2,
        socialid: doubleBase64Encrypt(mid),
        displayname: lineProfile.displayName,
      }),
      // cmsExternal.dataPillar([{
      //   line_user_id: mid,
      //   line_display_name: lineProfile.displayName,
      //   line_display_image: lineProfile.pictureUrl,
      //   data_pillar: 'Line',
      //   definition: 'Webhook',
      //   data_point: 'follow',
      // },
      // {
      //   line_user_id: mid,
      //   line_display_name: lineProfile.displayName,
      //   line_display_image: lineProfile.pictureUrl,
      //   data_pillar: 'Personal',
      //   definition: 'userID',
      //   data_point: mid,
      // },
      // {
      //   line_user_id: mid,
      //   line_display_name: lineProfile.displayName,
      //   line_display_image: lineProfile.pictureUrl,
      //   data_pillar: 'User Register',
      //   definition: 'Tier',
      //   data_point: '1',
      // }]),
    ]);
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

    return { status, message: err.message, data };
  }
};

export default {
  createTransactionLineNotifies,
  createManyTransactionLineNotifies,
  createTransactionHistoryFileLineNotifies,
  findTransactionHistoryFileLineNotifies,
  getTransactionLineNotifies,
  updateTransactionLineNotifies,
  cronGetLineNotifiesBeforeDue,
  cronGetLineNotifiesAfterDue,
  cronSendMessageLineNotifiesBeforeDue,
  cronSendMessageLineNotifiesAfterDue,
  sendFollow,
};
