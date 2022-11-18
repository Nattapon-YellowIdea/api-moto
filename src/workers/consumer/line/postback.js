import querystring from 'querystring';
import _ from 'lodash';
import { replyMessage } from '../../../utils/line.js';
import zwizExternal from '../../../external/zwiz.js';
import registerService from '../../../services/registerService.service.js';
import botService from '../../../services/bot.service.js';
import agentChatMessage from '../../../constant/nt/messages/agent-chat.js';
import leadFormMessage from '../../../constant/nt/messages/lead-form.js';
import shareLocationMessage from '../../../constant/nt/messages/share-location.js';
import registerServiceTopicMessage from '../../../constant/nt/messages/register-service-topic.js';
import registerServicePackageMessage from '../../../constant/nt/messages/register-service-promotion.js';
import registerServiceInstrumentMessage from '../../../constant/nt/messages/register-service-instrument.js';
import workingTimecontroller from '../../../controllers/working-time.controller.js';

const handleEvent = async (event) => {
  try {
    const agentMode = await botService.chackAgentChatMode({ line_user_id: event.source.userId, ended_at: null });

    if (agentMode) {
      return Promise.resolve('Agent Mode');
    }
    const data = querystring.parse(event.postback.data);

    if (data.action === 'broadband') {
      const dataRegisterService = await registerService.findMasterRegisterService();

      if (!dataRegisterService) {
        return Promise.all([
          replyMessage(event.replyToken, {
            type: 'text',
            text: 'ไม่มีบริการ',
          }),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  {
                    type: 'text',
                    text: 'ไม่มีบริการ',
                  },
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }

      const broadband = _.find(dataRegisterService.datas, (result) => result.action === 'broadband');
      if (data.layer === '1') {
        await registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId });
        return Promise.all([
          replyMessage(event.replyToken, registerServiceTopicMessage()),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  registerServiceTopicMessage(),
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }

      if (data.layer === '2') {
        await registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId });
        if (data.data === 'agent_chat') {
          const checkWorkingTime = await workingTimecontroller.checkWorkingTime();
          if (checkWorkingTime) {
            return [];
          }
          return Promise.all([
            replyMessage(event.replyToken, [
              {
                type: 'text',
                text: 'ขออภัยในความไม่สะดวกครับ\nขณะนี้อยู่นอกเวลาทำการ กรุณากรอกข้อมูลของท่านลง\nในแบบฟอร์ม เจ้าหน้าที่จะดำเนินการติดต่อกลับโดยเร็ว',
              },
              leadFormMessage(`${process.env.LINE_LIFF_100}/register/broadband/lead-form`),
            ]),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ขออภัยในความไม่สะดวกครับ\nขณะนี้อยู่นอกเวลาทำการ กรุณากรอกข้อมูลของท่านลง\nในแบบฟอร์ม เจ้าหน้าที่จะดำเนินการติดต่อกลับโดยเร็ว',
                    },
                    leadFormMessage(`${process.env.LINE_LIFF_100}/register/broadband/lead-form`),
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }
        const transaction = await registerService.findTransactionRegisterService({ line_user_id: event.source.userId, type: 'register-service', status: '' });
        if (transaction === null) {
          return Promise.all([
            replyMessage(event.replyToken, registerServicePackageMessage(broadband.datas[1].datas)),
            registerService.createTransactionRegisterService({
              line_user_id: event.source.userId,
              type: 'register-service',
              promotion: '',
              instrument: '',
              last_activity: 'register-service',
            }),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    registerServicePackageMessage(broadband.datas[1].datas),
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        return Promise.all([
          replyMessage(event.replyToken, registerServicePackageMessage(broadband.datas[1].datas)),
          registerService.updateTransactionRegisterService({ _id: transaction._id }, {
            promotion: '',
            instrument: '',
            last_activity: 'register-service',
            promotion_name: '',
            promotion_speed: '',
            promotion_speed_id: '',
            promotion_package_id: '',
            promotion_offer_id: '',
            promotion_service_name: '',
            promotion_promotion_id: '',
            promotion_price: 0,
            promotion_maintenance: 0,
            promotion_setup: 0,
            promotion_fee: 0,
            promotion_over_cable: 0,
            instrument_name: '',
            instrument_price: 0,
            instrument_description: '',
            instrument_cost_ont: 0,
            instrument_ont_int: 0,
          }),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  registerServicePackageMessage(broadband.datas[1].datas),
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }

      if (data.layer === '3') {
        await registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId });
        const transaction = await registerService.findTransactionRegisterService({ line_user_id: event.source.userId, type: 'register-service', status: '' });

        if (transaction === null) {
          return Promise.all([
            replyMessage(event.replyToken, {
              type: 'text',
              text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
            }),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        if (transaction.last_activity === 'share_location' || transaction.last_activity === 'register-form') {
          return Promise.all([
            replyMessage(event.replyToken, {
              type: 'text',
              text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
            }),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        const promotion = _.find(broadband.datas[1].datas, (result) => result.ref === data.ref);

        registerService.updateTransactionRegisterService({ _id: transaction._id }, {
          promotion: data.ref,
          instrument: '',
          last_activity: 'promotion',
          promotion_name: promotion.detail.name,
          promotion_speed: promotion.detail.speed,
          promotion_speed_id: promotion.detail.speed_id,
          promotion_package_id: promotion.detail.package_id,
          promotion_offer_id: promotion.detail.offer_id,
          promotion_service_name: promotion.detail.service_name,
          promotion_promotion_id: promotion.detail.promotion_id,
          promotion_price: promotion.detail.price,
          promotion_maintenance: promotion.detail.maintenance,
          promotion_setup: promotion.detail.setup,
          promotion_fee: promotion.detail.fee,
          promotion_over_cable: promotion.detail.over_cable,
          instrument_name: '',
          instrument_price: 0,
          instrument_description: '',
          instrument_cost_ont: 0,
          instrument_ont_int: 0,
        });

        if (promotion.datas.length === 0) {
          registerService.updateTransactionRegisterService({ _id: transaction._id }, {
            instrument: '',
            last_activity: 'instrument',
            instrument_name: '',
            instrument_price: 0,
            instrument_description: '',
            instrument_cost_ont: 0,
            instrument_ont_int: 0,
          });

          return Promise.all([
            replyMessage(event.replyToken, shareLocationMessage()),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    shareLocationMessage(),
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        return Promise.all([
          replyMessage(event.replyToken, registerServiceInstrumentMessage(promotion.datas)),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  registerServiceInstrumentMessage(promotion.datas),
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }

      if (data.layer === '4') {
        await registerService.deleteTransactionFindCenter({ line_user_id: event.source.userId });
        const transaction = await registerService.findTransactionRegisterService({ line_user_id: event.source.userId, type: 'register-service', status: '' });

        if (transaction === null) {
          return Promise.all([
            replyMessage(event.replyToken, {
              type: 'text',
              text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
            }),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        const promotion = _.find(broadband.datas[1].datas, (result) => result.ref === transaction.promotion);
        if (typeof (promotion) === 'undefined') {
          return Promise.all([
            replyMessage(event.replyToken, [
              {
                type: 'text',
                text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
              },
            ]),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        const instrument = _.find(promotion.datas, (result) => result.ref === data.ref);
        if (typeof (instrument) === 'undefined') {
          return Promise.all([
            replyMessage(event.replyToken, [
              {
                type: 'text',
                text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
              },
              registerServiceInstrumentMessage(promotion.datas),
            ]),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                    registerServiceInstrumentMessage(promotion.datas),
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        if (transaction.last_activity === 'share_location' || transaction.last_activity === 'register-form') {
          return Promise.all([
            replyMessage(event.replyToken, {
              type: 'text',
              text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
            }),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'ท่านทำรายการไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
                    },
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        return Promise.all([
          registerService.updateTransactionRegisterService({ _id: transaction._id }, {
            instrument: data.ref,
            last_activity: 'instrument',
            instrument_name: instrument.detail.name,
            instrument_price: instrument.detail.price,
            instrument_description: instrument.detail.description,
            instrument_cost_ont: instrument.detail.cost_ont,
            instrument_ont_int: instrument.detail.ont_int,
          }),
          replyMessage(event.replyToken, shareLocationMessage()),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  shareLocationMessage(),
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }
    } else if (data.action === 'fixed_line') {
      if (data.layer === '1') {
        // Chaeck chat setting
        const checkWorkingTime = await workingTimecontroller.checkWorkingTime();
        if (checkWorkingTime) {
          return Promise.all([
            replyMessage(event.replyToken, [
              {
                type: 'text',
                text: 'แชทคุยกับเจ้าหน้าที่ เพื่อสมัครบริการ',
              },
              agentChatMessage(),
            ]),
            zwizExternal.webhookForward({
              pageId: process.env.ZWIZ_PAGE_ID,
              data: {
                isBot: 0,
                isAgent: 0,
                isMatching: 0,
                isPushMessage: 0,
                lineOriginal: event,
                autoResponse: {
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: 'แชทคุยกับเจ้าหน้าที่ เพื่อสมัครบริการ',
                    },
                    agentChatMessage(),
                  ],
                },
                pushMessage: null,
              },
            }),
          ]);
        }

        return Promise.all([
          replyMessage(event.replyToken, [
            {
              type: 'text',
              text: 'ขออภัยในความไม่สะดวกครับ\nขณะนี้อยู่นอกเวลาทำการ กรุณากรอกข้อมูลของท่านลง\nในแบบฟอร์ม เจ้าหน้าที่จะดำเนินการติดต่อกลับโดยเร็ว',
            },
            leadFormMessage(`${process.env.LINE_LIFF_100}/register/fixed-line/lead-form`),
          ]),
          zwizExternal.webhookForward({
            pageId: process.env.ZWIZ_PAGE_ID,
            data: {
              isBot: 0,
              isAgent: 0,
              isMatching: 0,
              isPushMessage: 0,
              lineOriginal: event,
              autoResponse: {
                replyToken: event.replyToken,
                messages: [
                  {
                    type: 'text',
                    text: 'ขออภัยในความไม่สะดวกครับ\nขณะนี้อยู่นอกเวลาทำการ กรุณากรอกข้อมูลของท่านลง\nในแบบฟอร์ม เจ้าหน้าที่จะดำเนินการติดต่อกลับโดยเร็ว',
                  },
                  leadFormMessage(`${process.env.LINE_LIFF_100}/register/fixed-line/lead-form`),
                ],
              },
              pushMessage: null,
            },
          }),
        ]);
      }
    }

    return Promise.resolve('Nothing to do');
  } catch (err) {
    return Promise.reject(err);
  }
};

const message = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all(data.events.map(handleEvent));
};

export default message;
