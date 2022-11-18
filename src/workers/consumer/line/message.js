import _ from 'lodash';
import moment from 'moment-timezone';
import redisConn from '../../../config/redis.js';
import { replyMessage, getProfile } from '../../../utils/line.js';
import botKeyword from '../../../constant/bot/keyword.js';
import ntKeyword from '../../../constant/nt/keyword.js';
import { MasterRegister, MasterRegisterService } from '../../../models/nt.model.js';
import shareLocationFindCenterMessage from '../../../constant/nt/messages/share-location-find-center.js';
import registerServiceMessage from '../../../constant/nt/messages/register-service.js';
import leadFormMessage from '../../../constant/nt/messages/lead-form.js';
import registerServiceFormMessage from '../../../constant/nt/messages/register-service-form.js';
import eServiceNotConnectMessage from '../../../constant/nt/messages/e-service-not-connect.js';
import eServiceLoginMethod from '../../../constant/nt/messages/e-service-login-method.js';
import eServiceCheckAndPay from '../../../constant/nt/messages/e-service-check-and-pay.js';
import eServiceCheckBalance from '../../../constant/nt/messages/e-service-check-balance.js';
import findServiceCenter from '../../../constant/nt/messages/find-service-center.js';
import botService from '../../../services/bot.service.js';
import registerService from '../../../services/registerService.service.js';
import workingTimecontroller from '../../../controllers/working-time.controller.js';
import fttxExternal from '../../../external/fttx.js';
import scomExternal from '../../../external/scom.js';
import zwizExternal from '../../../external/zwiz.js';
import crmExternal from '../../../external/crm.js';
import { getKeywordMatch } from '../../../models/redis.model.js';
import eServiceExternal from '../../../external/eService.js';
import eServiceService from '../../../services/e-service.service.js';
import { strNumToDec, billingFullName } from '../../../utils/helper.js';
import registerServicePackageMessage from '../../../constant/nt/messages/register-service-promotion.js';
import registerServiceInstrumentMessage from '../../../constant/nt/messages/register-service-instrument.js';
import eServiceCheckBalanceBANotFound from '../../../constant/nt/messages/e-service-check-balance-ba-not-found.js';
import eServiceCheckBillNotFound from '../../../constant/nt/messages/e-service-bill-not-found.js';

const getDetailLocation = async (data) => {
  const resultLocation = await scomExternal.getCominfoOfficeByLocation({
    location: data,
  });

  if (resultLocation.data) {
    if (resultLocation.data['soap:body']) {
      if (resultLocation.data['soap:body'].getcominfoofficebylocationresponse) {
        if (resultLocation.data['soap:body'].getcominfoofficebylocationresponse.getcominfoofficebylocationresult['diffgr:diffgram']) {
          if (resultLocation.data['soap:body'].getcominfoofficebylocationresponse.getcominfoofficebylocationresult['diffgr:diffgram'].newdataset) {
            const { table } = resultLocation.data['soap:body'].getcominfoofficebylocationresponse.getcominfoofficebylocationresult['diffgr:diffgram'].newdataset;

            let tel = '';

            if (table.tel_information) {
              const telInformation = _.split(table.tel_information, ',');

              if (telInformation.length > 0) {
                tel = _.head(telInformation);
              } else {
                tel = '1888';
              }
            } else {
              tel = '1888';
            }

            return {
              location_name: table.location_name,
              time_finance: table.time_finance,
              latitude: table.latitude,
              longitude: table.longitude,
              tel_information: tel,
            };
          }
        }
      }
    }
  }
  return {
    location_name: '-',
    time_finance: '-',
    latitude: '-',
    longitude: '-',
    tel_information: '-',
  };
};

const handleEvent = async (event) => {
  try {
    const lineProfile = await getProfile(event.source.userId);

    const agentMode = await botService.chackAgentChatMode({ line_user_id: event.source.userId, ended_at: null });

    if (agentMode) {
      await zwizExternal.webhookForward({
        pageId: process.env.ZWIZ_PAGE_ID,
        data: {
          isBot: 0,
          isAgent: 1,
          isMatching: 0,
          isPushMessage: 0,
          lineOriginal: event,
          autoResponse: null,
          pushMessage: null,
        },
      });
      await botService.createTransactionAgentChatHistories({ line_user_id: event.source.userId, user_event: event });

      return Promise.all([
        botService.createTransactionAgentChatHistories({ line_user_id: event.source.userId, user_event: event }),
      ]);
    }

    if (event.message.type === 'text') {
      const matchingRegisterServiceKeyword = await MasterRegisterService.findOne({ keyword: { $in: [event.message.text] } });

      if (matchingRegisterServiceKeyword) {
        return replyMessage(event.replyToken, registerServiceMessage(matchingRegisterServiceKeyword.datas));
      }

      const matchingNtKeyword = _.findIndex(ntKeyword, (keyword) => keyword === event.message.text);
      if (matchingNtKeyword > -1) {
        let message = {};
        switch (ntKeyword[matchingNtKeyword]) {
          case 'ค้นหาศูนย์บริการใกล้คุณ':
            await registerService.createTransactionFindCenter({ line_user_id: event.source.userId });
            message = shareLocationFindCenterMessage();
            break;
          case 'สมัครบริการ NT eService': {
            const checkRegister = await MasterRegister.findOne({ line_user_id: event.source.userId });

            if (checkRegister === null) {
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            if (checkRegister.tier === 1) {
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            if (checkRegister.tier === 2 || checkRegister.tier === 3) {
              if (checkRegister.serviceAccess) {
                message = [{ type: 'text', text: 'ท่านได้ทำการลงทะเบียน' }];
                break;
              }
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            break;
          }
          case 'เช็กยอด/จ่ายบิล': {
            const checkRegister = await MasterRegister.findOne({ line_user_id: event.source.userId });

            if (checkRegister === null) {
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            if (checkRegister.tier === 1) {
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            if (checkRegister.tier === 2 || checkRegister.tier === 3) {
              if (checkRegister.serviceAccess) {
                message = eServiceCheckAndPay();
                break;
              }
              message = [
                eServiceNotConnectMessage(),
                {
                  type: 'text',
                  text: 'NT Quick Pay สำหรับชำระค่าบริการของ CAT (เดิม) https://quickpay.nteservice.com/',
                },
              ];
              break;
            }

            break;
          }
          case 'เข้าสู่ระบบ':
            message = eServiceLoginMethod();
            break;
          case 'เช็กยอด': {
            // Always refresh token
            const userData = await eServiceService.getUserData({ line_user_id: event.source.userId });

            if (!userData) {
              message = eServiceNotConnectMessage();
              break;
            }

            const transactionLoginResult = await eServiceService.getTransactionLogin({ line_user_id: event.source.userId });

            const requestTokenPayload = {
              socialtype: 2,
              socialid: userData.socialid,
              refresh_token: transactionLoginResult.refreshToken.token,
              'x-clientip': '0.0.0.0',
            };

            const requestTokenResult = await eServiceExternal.requestMemberToken(requestTokenPayload);

            if (requestTokenResult.data.success === false) {
              message = [{ type: 'text', text: 'ไม่พบยอด' }];
              break;
            }

            await eServiceService.updateNewToken({ line_user_id: event.source.userId }, { serviceAccess: requestTokenResult.data.responses.data.serviceAccess });
            await eServiceService.updateTransactionLogin({ line_user_id: event.source.userId }, { line_user_id: event.source.userId, ...requestTokenResult.data.responses.data });

            const result = await eServiceExternal.getBaLists({
              service_access_token: requestTokenResult.data.responses.data.serviceAccess,
              'x-clientip': '0.0.0.0',
            });

            const { fixedline, mobile } = result.data.responses.data.balists;

            const datenow = moment.tz(new Date(), 'Asia/Bangkok');
            datenow.add(543, 'years');

            if (_.isArray(fixedline) && fixedline.length === 0 && _.isArray(mobile) && mobile.length === 0) {
              message = eServiceCheckBalanceBANotFound();
              break;
            }

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
                    fullName: '',
                    note: '',
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

            // Loop for flex
            const { fixedline: billListFixedLine, mobile: billListMobile } = result.data.responses.data.balists;

            const messagesList = [];
            const flexDataList = [];

            const createMessageList = (list) => {
              list.forEach(async (item) => {
                const objFlex = {
                  serviceno: item.bill_summary.accountnum,
                  serviceid: item.serviceid,
                  fullName: item.bill_summary.fullName,
                };

                if (item.bill_summary.data.length === 0) {
                  flexDataList.push(objFlex);
                }

                if (item.bill_summary.data.length === 1) {
                  objFlex.bill_date = item.bill_summary.data[0]['rbm1:bill_dtm'];
                  objFlex.bill_number = item.bill_summary.data[0]['rbm1:invoice_num'];
                  objFlex.due_date = item.bill_summary.data[0]['rbm1:payment_due_dat'];
                  objFlex.unpaid_amount = strNumToDec(item.bill_summary.data[0]['rbm1:unpaid_amt']);
                  objFlex.billList = [];
                  flexDataList.push(objFlex);
                }

                if (item.bill_summary.data.length > 1) {
                  const billList = [];
                  const sumInvoice = item.bill_summary.data.reduce((sum, tax) => sum + strNumToDec(tax['rbm1:unpaid_amt']), 0);

                  item.bill_summary.data.forEach((elem) => {
                    billList.push({
                      bill_date: elem['rbm1:bill_dtm'],
                      bill_number: elem['rbm1:invoice_num'],
                      due_date: elem['rbm1:payment_due_dat'],
                      unpaid_amount: strNumToDec(elem['rbm1:unpaid_amt']),
                    });
                  });

                  objFlex.billList = billList;
                  objFlex.unpaid_amount = sumInvoice;
                  flexDataList.push(objFlex);
                }
              });
            };

            if (_.isArray(billListFixedLine)) {
              if (billListFixedLine.length > 0) {
                createMessageList(billListFixedLine);
              }
            }

            if (_.isArray(billListMobile)) {
              if (billListMobile.length > 0) {
                createMessageList(billListMobile);
              }
            }

            if (flexDataList.length === 0) {
              message = [{ type: 'text', text: 'ไม่พบยอด' }];
              break;
            }

            // push carousel each time 10 bubble inside
            const chunkSize = 10;

            for (let i = 0; i < flexDataList.length; i += chunkSize) {
              const chunk = flexDataList.slice(i, i + chunkSize);
              messagesList.push(eServiceCheckBalance(chunk));
            }

            message = messagesList;

            break;
          }

          // no default
        }

        if (!_.isEmpty(message)) {
          await zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                message,
              },
              pushMessage: null,
            },
          });

          return Promise.all([
            replyMessage(event.replyToken, message),
          ]);
        }
      }

      const matchingBotKeyword = _.findIndex(botKeyword, (keyword) => keyword === event.message.text);
      if (matchingBotKeyword > -1) {
        const checkWorkingTime = await workingTimecontroller.checkWorkingTime();
        if (checkWorkingTime) {
          await zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 1,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: null,
              pushMessage: null,
            },
          });

          return Promise.all([
            botService.createTransactionAgentChatMode({
              line_user_id: event.source.userId,
            }),
            botService.createTransactionAgentChatHistories({
              line_user_id: event.source.userId,
              user_event: event,
            }),
          ]);
        }
      }

      const reusltRedis = await redisConn.get(`line_auto_response:${process.env.COMPANY_ID}`);
      const dataRedis = JSON.parse(reusltRedis);

      if (reusltRedis !== null) {
        try {
          const replyKeyword = await getKeywordMatch(dataRedis, event.message.text);

          if (replyKeyword) {
            const messages = [];

            replyKeyword.messages.forEach(async (message) => {
              const msg = message;

              if (msg.type === 'text') {
                if (msg.text.search('[Display Name]') > -1) {
                  const str = msg.text;
                  const str1 = str.replace(/[\[\]']+/g, '');
                  const str3 = str1.replace(/Display Name/g, lineProfile.displayName);
                  msg.text = str3;
                }

                messages.push(msg);
              } else if (msg.type === 'image') {
                messages.push(msg);
              } else if (msg.type === 'imagemap') {
                msg.baseUrl = `${msg.baseUrl}?w=1040`;
                msg.altText = replyKeyword.name;

                messages.push(msg);
              } else if (msg.type === 'personalize') {
                let isDone = false;

                if (msg.body.contents[0].contents.length === 2 && msg.body.contents[0].contents[1].contents.length === 2 && isDone !== true) {
                  if (msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image') {
                    msg.body.contents[0].contents[1].contents[0].contents[0].url = lineProfile.pictureUrl;

                    if (msg.body.contents[0].contents[1].contents[1].type === 'text') {
                      msg.body.contents[0].contents[1].contents[1].text = lineProfile.displayName;
                    }

                    isDone = true;
                  }
                } else if (msg.body.contents[0].contents[1].contents.length === 1 && msg.body.contents[0].contents[1].contents[0].type === 'text' && isDone !== true) {
                  if (msg.body.contents[0].contents[1].contents[0].type === 'text') {
                    msg.body.contents[0].contents[1].contents[0].text = lineProfile.displayName;
                  }
                } else if (msg.body.contents[0].contents[1].contents.length === 1 && msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image' && isDone !== true) {
                  if (msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image') {
                    msg.body.contents[0].contents[1].contents[0].contents[0].url = lineProfile.pictureUrl;
                  }
                }

                const flex = {
                  type: 'flex',
                  altText: 'personalize',
                  contents: {
                    type: 'carousel',
                    contents: [
                      {
                        type: 'bubble',
                        body: {
                          type: 'box',
                          layout: 'vertical',
                          contents: `${msg.body.contents}`,
                          paddingAll: '0px',
                        },
                      },
                    ],
                  },
                };
                flex.contents.contents[0].body.contents = msg.body.contents;

                messages.push(flex);
              } else {
                messages.push(msg);
              }
            });
            await zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages,
                },
                pushMessage: null,
              },
            });

            return Promise.all([
              replyMessage(event.replyToken, messages),
            ]);
          }
        } catch (err) {
          return Promise.reject(err);
        }
      }
      const resultWebhookForward = await zwizExternal.webhookForward({
        pageId: process.env.ZWIZ_PAGE_ID,
        data: {
          isBot: 1,
          isAgent: 0,
          isMatching: 0,
          isPushMessage: 0,
          lineOriginal: event,
          autoResponse: null,
          pushMessage: null,
        },
      });

      if (resultWebhookForward.data) {
        if (resultWebhookForward.data.status === true) {
          if (resultWebhookForward.data.answer) {
            return Promise.all([replyMessage(event.replyToken, resultWebhookForward.data.answer)]);
          }
          if (resultWebhookForward.data.keyword) {
            const matchingRegisterServiceKeyword2 = await MasterRegisterService.findOne({ keyword: { $in: [resultWebhookForward.data.keyword] } });
            if (matchingRegisterServiceKeyword2) {
              return Promise.all([
                replyMessage(event.replyToken, registerServiceMessage(matchingRegisterServiceKeyword2.datas)),
              ]);
            }

            const matchingNtKeyword2 = _.findIndex(ntKeyword, (keyword) => keyword === resultWebhookForward.data.keyword);
            if (matchingNtKeyword2 > -1) {
              let message = {};
              switch (ntKeyword[matchingNtKeyword2]) {
                case 'ค้นหาศูนย์บริการใกล้คุณ':
                  await registerService.createTransactionFindCenter({ line_user_id: event.source.userId });
                  message = shareLocationFindCenterMessage();
                  break;
                case 'สมัครบริการ NT eService': {
                  const checkRegister = await MasterRegister.findOne({ line_user_id: event.source.userId });

                  if (checkRegister === null) {
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  if (checkRegister.tier === 1) {
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  if (checkRegister.tier === 2 || checkRegister.tier === 3) {
                    if (checkRegister.serviceAccess) {
                      message = [{ type: 'text', text: 'ท่านได้ทำการลงทะเบียน' }];
                      break;
                    }
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  break;
                }
                case 'เช็กยอด/จ่ายบิล': {
                  const checkRegister = await MasterRegister.findOne({ line_user_id: event.source.userId });

                  if (checkRegister === null) {
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  if (checkRegister.tier === 1) {
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  if (checkRegister.tier === 2 || checkRegister.tier === 3) {
                    if (checkRegister.serviceAccess) {
                      message = eServiceCheckAndPay();
                      break;
                    }
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  break;
                }
                case 'เข้าสู่ระบบ':
                  message = eServiceLoginMethod();
                  break;
                case 'เช็กยอด': {
                  // Always refresh token
                  const userData = await eServiceService.getUserData({ line_user_id: event.source.userId });

                  if (!userData) {
                    message = eServiceNotConnectMessage();
                    break;
                  }

                  const transactionLoginResult = await eServiceService.getTransactionLogin({ line_user_id: event.source.userId });

                  const requestTokenPayload = {
                    socialtype: 2,
                    socialid: userData.socialid,
                    refresh_token: transactionLoginResult.refreshToken.token,
                    'x-clientip': '0.0.0.0',
                  };

                  const requestTokenResult = await eServiceExternal.requestMemberToken(requestTokenPayload);

                  if (requestTokenResult.data.success === false) {
                    message = [{ type: 'text', text: 'ไม่พบยอด' }];
                    break;
                  }

                  await eServiceService.updateNewToken({ line_user_id: event.source.userId }, { serviceAccess: requestTokenResult.data.responses.data.serviceAccess });
                  await eServiceService.updateTransactionLogin({ line_user_id: event.source.userId }, { line_user_id: event.source.userId, ...requestTokenResult.data.responses.data });

                  const result = await eServiceExternal.getBaLists({
                    service_access_token: requestTokenResult.data.responses.data.serviceAccess,
                    'x-clientip': '0.0.0.0',
                  });

                  const { fixedline, mobile } = result.data.responses.data.balists;

                  const datenow = moment.tz(new Date(), 'Asia/Bangkok');
                  datenow.add(543, 'years');

                  if (_.isArray(fixedline) && fixedline.length === 0 && _.isArray(mobile) && mobile.length === 0) {
                    message = eServiceCheckBalanceBANotFound();
                    break;
                  }

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
                          fullName: '',
                          note: '',
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

                  // Loop for flex
                  const { fixedline: billListFixedLine, mobile: billListMobile } = result.data.responses.data.balists;

                  const messagesList = [];
                  const flexDataList = [];

                  const createMessageList = (list) => {
                    list.forEach(async (item) => {
                      const objFlex = {
                        serviceno: item.bill_summary.accountnum,
                        serviceid: item.serviceid,
                        fullName: item.bill_summary.fullName,
                      };

                      if (item.bill_summary.data.length === 0) {
                        flexDataList.push(objFlex);
                      }

                      if (item.bill_summary.data.length === 1) {
                        objFlex.bill_date = item.bill_summary.data[0]['rbm1:bill_dtm'];
                        objFlex.bill_number = item.bill_summary.data[0]['rbm1:invoice_num'];
                        objFlex.due_date = item.bill_summary.data[0]['rbm1:payment_due_dat'];
                        objFlex.unpaid_amount = strNumToDec(item.bill_summary.data[0]['rbm1:unpaid_amt']);
                        objFlex.billList = [];
                        flexDataList.push(objFlex);
                      }

                      if (item.bill_summary.data.length > 1) {
                        const billList = [];
                        const sumInvoice = item.bill_summary.data.reduce((sum, tax) => sum + strNumToDec(tax['rbm1:unpaid_amt']), 0);

                        item.bill_summary.data.forEach((elem) => {
                          billList.push({
                            bill_date: elem['rbm1:bill_dtm'],
                            bill_number: elem['rbm1:invoice_num'],
                            due_date: elem['rbm1:payment_due_dat'],
                            unpaid_amount: strNumToDec(elem['rbm1:unpaid_amt']),
                          });
                        });

                        objFlex.billList = billList;
                        objFlex.unpaid_amount = sumInvoice;
                        flexDataList.push(objFlex);
                      }
                    });
                  };

                  if (_.isArray(billListFixedLine)) {
                    if (billListFixedLine.length > 0) {
                      createMessageList(billListFixedLine);
                    }
                  }

                  if (_.isArray(billListMobile)) {
                    if (billListMobile.length > 0) {
                      createMessageList(billListMobile);
                    }
                  }

                  if (flexDataList.length === 0) {
                    message = [{ type: 'text', text: 'ไม่พบยอด' }];
                    break;
                  }

                  // push carousel each time 10 bubble inside
                  const chunkSize = 10;

                  for (let i = 0; i < flexDataList.length; i += chunkSize) {
                    const chunk = flexDataList.slice(i, i + chunkSize);
                    messagesList.push(eServiceCheckBalance(chunk));
                  }

                  message = messagesList;

                  break;
                }

                // no default
              }

              if (!_.isEmpty(message)) {
                await zwizExternal.webhookForward({
                  pageId: process.env.ZWIZ_PAGE_ID,
                  data: {
                    isBot: 0,
                    isAgent: 0,
                    isMatching: 0,
                    isPushMessage: 0,
                    lineOriginal: event,
                    autoResponse: {
                      replyToken: event.replyToken,
                      message,
                    },
                    pushMessage: null,
                  },
                });

                return Promise.all([
                  replyMessage(event.replyToken, message),
                ]);
              }
            }

            // หา Redis
            if (reusltRedis !== null) {
              try {
                const replyKeyword = await getKeywordMatch(dataRedis, resultWebhookForward.data.keyword);

                if (replyKeyword) {
                  const messages = [];

                  replyKeyword.messages.forEach(async (message) => {
                    const msg = message;

                    if (msg.type === 'text') {
                      if (msg.text.search('[Display Name]') > -1) {
                        const str = msg.text;
                        const str1 = str.replace(/[\[\]']+/g, '');
                        const str3 = str1.replace(/Display Name/g, lineProfile.displayName);
                        msg.text = str3;
                      }

                      messages.push(msg);
                    } else if (msg.type === 'image') {
                      messages.push(msg);
                    } else if (msg.type === 'imagemap') {
                      msg.baseUrl = `${msg.baseUrl}?w=1040`;
                      msg.altText = replyKeyword.name;

                      messages.push(msg);
                    } else if (msg.type === 'personalize') {
                      let isDone = false;

                      if (msg.body.contents[0].contents.length === 2 && msg.body.contents[0].contents[1].contents.length === 2 && isDone !== true) {
                        if (msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image') {
                          msg.body.contents[0].contents[1].contents[0].contents[0].url = lineProfile.pictureUrl;

                          if (msg.body.contents[0].contents[1].contents[1].type === 'text') {
                            msg.body.contents[0].contents[1].contents[1].text = lineProfile.displayName;
                          }

                          isDone = true;
                        }
                      } else if (msg.body.contents[0].contents[1].contents.length === 1 && msg.body.contents[0].contents[1].contents[0].type === 'text' && isDone !== true) {
                        if (msg.body.contents[0].contents[1].contents[0].type === 'text') {
                          msg.body.contents[0].contents[1].contents[0].text = lineProfile.displayName;
                        }
                      } else if (msg.body.contents[0].contents[1].contents.length === 1 && msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image' && isDone !== true) {
                        if (msg.body.contents[0].contents[1].contents[0].contents[0].type === 'image') {
                          msg.body.contents[0].contents[1].contents[0].contents[0].url = lineProfile.pictureUrl;
                        }
                      }

                      const flex = {
                        type: 'flex',
                        altText: 'personalize',
                        contents: {
                          type: 'carousel',
                          contents: [
                            {
                              type: 'bubble',
                              body: {
                                type: 'box',
                                layout: 'vertical',
                                contents: `${msg.body.contents}`,
                                paddingAll: '0px',
                              },
                            },
                          ],
                        },
                      };
                      flex.contents.contents[0].body.contents = msg.body.contents;

                      messages.push(flex);
                    } else {
                      messages.push(msg);
                    }
                  });

                  await zwizExternal.webhookForward({
                    pageId: process.env.ZWIZ_PAGE_ID,
                    data: {
                      isBot: 0,
                      isAgent: 0,
                      isMatching: 0,
                      isPushMessage: 0,
                      lineOriginal: event,
                      autoResponse: {
                        replyToken: event.replyToken,
                        messages,
                      },
                      pushMessage: null,
                    },
                  });

                  return Promise.all([
                    replyMessage(event.replyToken, messages),
                  ]);
                }
              } catch (err) {
                return Promise.reject(err);
              }
            }
          }
        }
      }

      return Promise.all(['Nothing to do.']);
    }

    if (event.message.type === 'location') {
      const TransactionFindCenter = await registerService.findTransactionFindCenter({ line_user_id: event.source.userId });

      if (TransactionFindCenter) {
        const result = await scomExternal.getCominfoNearOfficeByLatLon({
          lat: event.message.latitude,
          lon: event.message.longitude,
          distance: 10000,
        });

        if (result.data) {
          if (result.data['soap:body']) {
            if (result.data['soap:body'].getcominfonearofficebylatlonresponse) {
              if (result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'] === '') {
                return Promise.all([
                  replyMessage(event.replyToken, [
                    {
                      type: 'text',
                      text: 'ขออภัยในความไม่สะดวก\nไม่พบศูนย์บริการใกล้เคียงในพื้นที่ของท่าน\nกรุณาลองอีกครั้ง หรือติดต่อ NT Contact Center 1888',
                    },
                    shareLocationFindCenterMessage(),
                  ]),
                ]);
              }

              if (result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'].newdataset) {
                const { table } = result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'].newdataset;

                const locationCode = [];
                if (Array.isArray(table) === true) {
                  table.forEach((data, index) => {
                    if (index < 5) {
                      locationCode.push(data.location_code);
                    }
                  });
                } else {
                  locationCode.push(table.location_code);
                }

                const dataCarousel = await Promise.all(locationCode.map(getDetailLocation));
                return Promise.all([
                  // registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId }),
                  replyMessage(event.replyToken, findServiceCenter(dataCarousel)),
                ]);
              }
            }
          }
        }
      }

      const transaction = await registerService.findTransactionRegisterService({ line_user_id: event.source.userId, type: 'register-service', status: '' });
      if (transaction) {
        // check choose package ?
        if (transaction.last_activity === 'register-service') {
          const dataRegisterService = await registerService.findMasterRegisterService();
          const broadband = _.find(dataRegisterService.datas, (result) => result.action === 'broadband');
          return Promise.all([
            replyMessage(event.replyToken, registerServicePackageMessage(broadband.datas[1].datas)),
          ]);
        }

        // check choose instrument ?
        if (transaction.last_activity === 'promotion') {
          const dataRegisterService = await registerService.findMasterRegisterService();
          const broadband = _.find(dataRegisterService.datas, (result) => result.action === 'broadband');
          const promotion = _.find(broadband.datas[1].datas, (result) => result.ref === transaction.promotion);
          return Promise.all([
            replyMessage(event.replyToken, registerServiceInstrumentMessage(promotion.datas)),
          ]);
        }

        if (transaction.last_activity !== 'share_location' || transaction.last_activity !== 'register-form') {
          const result = await fttxExternal.getSearchDpOnArea({
            lat: event.message.latitude,
            lng: event.message.longitude,
            dp_test: process.env.FTTX_DP_TEST,
            village: '',
            subdistrict: '',
            district_id: 0,
            province_id: 0,
          });

          let wsStatus = '';
          let wsStatusInt = '';
          let installLatlng = '';
          let deviceId = '';
          let deviceName = '';
          let deviceTypeName = '';
          let exchangeId = '';
          let exchangeName = '';
          let officeId = '';
          let officeName = '';
          let officeCode = '';
          let officeLatLon = '';
          let distance = '';
          let position = '';
          let overCableCost = '';
          let projectName = '';
          let projectOnline = '';
          let polyline = '';
          let deviceLatLon = '';

          if (result.data) {
            if (result.data['soap-env:body']) {
              if (result.data['soap-env:body']['ns1:getsearchdponarearesponse']) {
                if (result.data['soap-env:body']['ns1:getsearchdponarearesponse'].return) {
                  const { item } = result.data['soap-env:body']['ns1:getsearchdponarearesponse'].return;
                  if (item instanceof Array) {
                    const wsStatus1 = _.find(item, (o) => o.key === 'ws_status');
                    if (wsStatus1) {
                      wsStatus = wsStatus1.value;
                    }
                    const wsStatusInt1 = _.find(item, (o) => o.key === 'ws_status_int');
                    if (wsStatusInt1) {
                      wsStatusInt = wsStatusInt1.value;
                    }
                    const installLatlng1 = _.find(item, (o) => o.key === 'install_latlng');
                    if (installLatlng1) {
                      installLatlng = installLatlng1.value;
                    }
                    const deviceId1 = _.find(item, (o) => o.key === 'device_id');
                    if (deviceId1) {
                      deviceId = deviceId1.value;
                    }
                    const deviceName1 = _.find(item, (o) => o.key === 'device_name');
                    if (deviceName1) {
                      deviceName = deviceName1.value;
                    }
                    const deviceTypeName1 = _.find(item, (o) => o.key === 'device_type_name');
                    if (deviceTypeName1) {
                      deviceTypeName = deviceTypeName1.value;
                    }
                    const exchangeId1 = _.find(item, (o) => o.key === 'exchange_id');
                    if (exchangeId1) {
                      exchangeId = exchangeId1.value;
                    }
                    const exchangeName1 = _.find(item, (o) => o.key === 'exchange_name');
                    if (exchangeName1) {
                      exchangeName = exchangeName1.value;
                    }
                    const officeId1 = _.find(item, (o) => o.key === 'office_id');
                    if (officeId1) {
                      officeId = officeId1.value;
                    }
                    const officeName1 = _.find(item, (o) => o.key === 'office_name');
                    if (officeName1) {
                      officeName = officeName1.value;
                    }
                    const officeCode1 = _.find(item, (o) => o.key === 'office_code');
                    if (officeCode1) {
                      officeCode = officeCode1.value;
                    }
                    const officeLatLon1 = _.find(item, (o) => o.key === 'office_lat_lon');
                    if (officeLatLon1) {
                      officeLatLon = officeLatLon1.value;
                    }
                    const distance1 = _.find(item, (o) => o.key === 'distance');
                    if (distance1) {
                      distance = distance1.value;
                    }
                    const position1 = _.find(item, (o) => o.key === 'position');
                    if (position1) {
                      position = position1.value;
                    }
                    const overCableCost1 = _.find(item, (o) => o.key === 'over_cable_cost');
                    if (overCableCost1) {
                      overCableCost = overCableCost1.value;
                    }
                    const projectName1 = _.find(item, (o) => o.key === 'project_name');
                    if (projectName1) {
                      projectName = projectName1.value;
                    }
                    const projectOnline1 = _.find(item, (o) => o.key === 'project_online');
                    if (projectOnline1) {
                      projectOnline = projectOnline1.value;
                    }
                    const polyline1 = _.find(item, (o) => o.key === 'polyline');
                    if (polyline1) {
                      polyline = polyline1.value;
                    }
                    const deviceLatLon1 = _.find(item, (o) => o.key === 'device_lat_lon');
                    if (deviceLatLon1) {
                      deviceLatLon = deviceLatLon1.value;
                    }
                  }
                }
              }
            }
          }

          const createOrder = await registerService.updateTransactionRegisterService({ _id: transaction._id }, {
            // last_activity: 'share_location',
            latitude: event.message.latitude,
            longitude: event.message.longitude,
            // status: 'available',
            ws_status: wsStatus,
            ws_status_int: wsStatusInt,
            install_latlng: installLatlng,
            device_id: deviceId,
            device_name: deviceName,
            device_type_name: deviceTypeName,
            exchange_id: exchangeId,
            exchange_name: exchangeName,
            office_id: officeId,
            office_name: officeName,
            office_code: officeCode,
            office_lat_lon: officeLatLon,
            distance,
            position,
            over_cable_cost: overCableCost,
            project_name: projectName,
            project_online: projectOnline,
            polyline,
            device_lat_lon: deviceLatLon,
          });

          if (wsStatusInt === '1' && Number(distance) > -1 && Number(distance) < 301) {
            if (createOrder) {
              return Promise.all([
                registerService.updateTransactionRegisterService({ _id: transaction._id }, {
                  last_activity: 'share_location',
                  status: 'available',
                }),
                replyMessage(event.replyToken, [
                  {
                    type: 'text',
                    text: `${wsStatus}`,
                  },
                  {
                    type: 'text',
                    text: `Distance ${distance}`,
                  },
                  {
                    type: 'text',
                    text: 'จากการตรวจสอบเบื้องต้น พื้นที่ของท่านสามารถติดตั้งบริการ NT\nBroadband ได้ โดย NT จะสำรวจจุดติดตั้งอีกครั้ง\nกรุณากดสมัครบริการเพื่อดำเนินต่อไป',
                  },
                  registerServiceFormMessage(transaction),
                ]),
              ]);
            }
          }

          if (Number(distance) < 0 || Number(distance) > 300) {
            return Promise.all([
              // registerService.updateTransactionRegisterService({ _id: transaction._id }, {
              //   status: 'unavailable',
              // }),
              replyMessage(event.replyToken, [
                {
                  type: 'text',
                  text: `${wsStatus}`,
                },
                {
                  type: 'text',
                  text: `Distance ${distance}`,
                },
                {
                  type: 'text',
                  text: 'ขอบคุณที่ท่านสนใจบริการ NT Broadband\nกรุณากรอกข้อมูลของท่านลงในแบบฟอร์ม เจ้าหน้าที่จะดำเนินการ\nติดต่อกลับโดยเร็ว',
                },
                leadFormMessage(`${process.env.LINE_LIFF_100}/register/broadband/lead-form`),
              ]),
            ]);
          }

          if (wsStatusInt !== '1') {
            return Promise.all([
              // registerService.updateTransactionRegisterService({ _id: transaction._id }, {
              //   status: 'unavailable',
              // }),
              replyMessage(event.replyToken, [
                {
                  type: 'text',
                  text: `${wsStatus}`,
                },
              ]),
            ]);
          }
        }

        return Promise.all(['end share register']);
      }

      const result = await scomExternal.getCominfoNearOfficeByLatLon({
        lat: event.message.latitude,
        lon: event.message.longitude,
        distance: 10000,
      });

      if (result.data) {
        if (result.data['soap:body']) {
          if (result.data['soap:body'].getcominfonearofficebylatlonresponse) {
            if (result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'] === '') {
              return Promise.all([
                // registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId }),
                replyMessage(event.replyToken, [
                  {
                    type: 'text',
                    text: 'ขออภัยในความไม่สะดวก\nไม่พบศูนย์บริการใกล้เคียงในพื้นที่ของท่าน\nกรุณาลองอีกครั้ง หรือติดต่อ NT Contact Center 1888',
                  },
                  shareLocationFindCenterMessage(),
                ]),
              ]);
            }

            if (result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'].newdataset) {
              const { table } = result.data['soap:body'].getcominfonearofficebylatlonresponse.getcominfonearofficebylatlonresult['diffgr:diffgram'].newdataset;

              const locationCode = [];
              if (Array.isArray(table) === true) {
                table.forEach((data, index) => {
                  if (index < 5) {
                    locationCode.push(data.location_code);
                  }
                });
              } else {
                locationCode.push(table.location_code);
              }

              const dataCarousel = await Promise.all(locationCode.map(getDetailLocation));
              return Promise.all([
                // registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId }),
                replyMessage(event.replyToken, findServiceCenter(dataCarousel)),
              ]);
            }
          }
        }
      }
    }

    return zwizExternal.webhookForward({
      pageId: process.env.ZWIZ_PAGE_ID,
      data: {
        isBot: 0,
        isAgent: 0,
        isMatching: 0,
        isPushMessage: 0,
        lineOriginal: event,
        autoResponse: null,
        pushMessage: null,
      },
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

const message = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all(data.events.map(handleEvent));
};

export default message;
