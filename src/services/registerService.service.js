import _ from 'lodash';
import captureException from '../utils/captureException.js';
import {
  TransactionRegisterService, TransactionLeadForm, MasterRegisterService, TransactionFindCenter,
} from '../models/nt.model.js';
import fttxExternal from '../external/fttx.js';

const findTransactionRegisterService = async (payload) => {
  try {
    const result = TransactionRegisterService.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createTransactionRegisterService = async (payload) => {
  try {
    const result = new TransactionRegisterService(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateTransactionRegisterService = async (filter, payload) => {
  try {
    const result = TransactionRegisterService.findOneAndUpdate(filter, payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const createLeadForm = async (payload) => {
  try {
    const result = new TransactionLeadForm(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const findMasterRegisterService = async () => {
  try {
    const result = MasterRegisterService.findOne({}).sort({ created_at: -1 });

    return result;
  } catch (err) {
    captureException();
    throw err;
  }
};

const updateMasterRegisterService = async (payload) => {
  try {
    const isExist = await MasterRegisterService.countDocuments({});

    if (isExist) {
      return MasterRegisterService.findOneAndUpdate({ _id: payload.id }, payload);
    }

    const result = new MasterRegisterService(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getDetailRegisterService = async (payload) => {
  try {
    if (typeof payload.id !== 'undefined') {
      const result = await TransactionRegisterService.findOne({ _id: payload.id });
      return result;
    }
    if (typeof payload.payment_otc_order_ref !== 'undefined') {
      const result = await TransactionRegisterService.findOne({ payment_otc_order_ref: payload.payment_otc_order_ref });
      return result;
    }
    const result = await TransactionRegisterService.findOne({ order_status_code: payload.order_code });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getDetailMasterRegisterService = async (payload) => {
  try {
    const result = await MasterRegisterService.findOne(payload.id);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const extractresultCheckOrderStatus = async (resultCheckOrderStatus) => {
  let orderStatusOrderId = '';
  let orderStatusCode = '';
  let orderStatusSono = '';
  let orderStatusStatusId = '';
  let orderStatusStatusName = '';
  let orderStatusIsPaid = '';
  let orderStatusPromotionName = '';
  let orderStatusPackageName = '';
  let orderStatusSpeed = '';
  let orderStatusFullname = '';
  let orderStatusFilename = '';
  let orderStatusOfficeId = '';
  let orderStatusCostSetup = '';
  let orderStatusCostFee = '';
  let orderStatusCostMaintenance = '';
  let orderStatusCostont = '';
  let orderStatusCostOverCable = '';
  let orderStatusCustomerMobile = '';
  if (resultCheckOrderStatus.data) {
    if (resultCheckOrderStatus.data['soap-env:body']) {
      if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse']) {
        if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return) {
          const { item } = resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return;

          if (item instanceof Array) {
            const orderId = _.find(item, (o) => o.key === 'order_id');

            if (orderId) {
              orderStatusOrderId = orderId.value;
            }

            const code = _.find(item, (o) => o.key === 'code');

            if (code) {
              orderStatusCode = code.value;
            }

            const sono = _.find(item, (o) => o.key === 'sono');

            if (sono) {
              orderStatusSono = sono.value;
            }

            const statusId = _.find(item, (o) => o.key === 'status_id');

            if (statusId) {
              orderStatusStatusId = statusId.value;
            }

            const statusName = _.find(item, (o) => o.key === 'status_name');

            if (statusName) {
              orderStatusStatusName = statusName.value;
            }

            const isPaid = _.find(item, (o) => o.key === 'is_paid');

            if (isPaid) {
              orderStatusIsPaid = isPaid.value;
            }

            const promotionName = _.find(item, (o) => o.key === 'promotion_name');

            if (promotionName) {
              orderStatusPromotionName = promotionName.value;
            }

            const packageName = _.find(item, (o) => o.key === 'package_name');

            if (packageName) {
              orderStatusPackageName = packageName.value;
            }

            const speed = _.find(item, (o) => o.key === 'speed');

            if (speed) {
              orderStatusSpeed = speed.value;
            }

            const fullname = _.find(item, (o) => o.key === 'fullname');

            if (fullname) {
              orderStatusFullname = fullname.value;
            }

            const filename = _.find(item, (o) => o.key === 'filename');

            if (filename) {
              orderStatusFilename = filename.value;
            }

            const officeid = _.find(item, (o) => o.key === 'office_id');

            if (officeid) {
              orderStatusOfficeId = officeid.value;
            }

            const costsetup = _.find(item, (o) => o.key === 'cost_setup');

            if (costsetup) {
              orderStatusCostSetup = costsetup.value;
            }

            const costfee = _.find(item, (o) => o.key === 'cost_fee');

            if (costfee) {
              orderStatusCostFee = costfee.value;
            }

            const costmaintenance = _.find(item, (o) => o.key === 'cost_maintenance');

            if (costmaintenance) {
              orderStatusCostMaintenance = costmaintenance.value;
            }

            const costont = _.find(item, (o) => o.key === 'cost_ont');

            if (costont) {
              orderStatusCostont = costont.value;
            }

            const costovercable = _.find(item, (o) => o.key === 'cost_over_cable');

            if (costovercable) {
              orderStatusCostOverCable = costovercable.value;
            }

            const customermobile = _.find(item, (o) => o.key === 'customer_mobile');

            if (customermobile) {
              orderStatusCustomerMobile = customermobile.value;
            }
          }
        }
      }
    }
  }
  return {
    orderStatusOrderId,
    orderStatusCode,
    orderStatusSono,
    orderStatusStatusId,
    orderStatusStatusName,
    orderStatusIsPaid,
    orderStatusPromotionName,
    orderStatusPackageName,
    orderStatusSpeed,
    orderStatusFullname,
    orderStatusFilename,
    orderStatusOfficeId,
    orderStatusCostSetup,
    orderStatusCostFee,
    orderStatusCostMaintenance,
    orderStatusCostont,
    orderStatusCostOverCable,
    orderStatusCustomerMobile,
  };
};

const getSRList = async (payload) => {
  try {
    const result = await TransactionRegisterService.find({ line_user_id: payload.line_user_id, type: 'register-service', order_status_code: { $ne: '' } });

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const updateOrderStatus = async (payload) => {
  // input id, line_user_id,
  try {
    let orderStatusOrderId = '';
    let orderStatusCode = '';
    let orderStatusSono = '';
    let orderStatusStatusId = '';
    let orderStatusStatusName = '';
    let orderStatusIsPaid = '';
    let orderStatusPromotionName = '';
    let orderStatusPackageName = '';
    let orderStatusSpeed = '';
    let orderStatusFullname = '';
    let orderStatusFilename = '';
    let orderStatusOfficeId = '';
    let orderStatusCostSetup = '';
    let orderStatusCostFee = '';
    let orderStatusCostMaintenance = '';
    let orderStatusCostont = '';
    let orderStatusCostOverCable = '';
    let orderStatusCustomerMobile = '';

    const transaction = await this.findTransactionRegisterService({ order_status_code: payload.id });
    if (transaction) {
      const resultCheckOrderStatus = await fttxExternal.getCheckOrderStatus({
        value: transaction.order_code,
      });

      if (resultCheckOrderStatus.data) {
        if (resultCheckOrderStatus.data['soap-env:body']) {
          if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse']) {
            if (resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return) {
              const { item } = resultCheckOrderStatus.data['soap-env:body']['ns1:getcheckorderstatusresponse'].return;

              if (item instanceof Array) {
                const statusId = _.find(item, (o) => o.key === 'status_id');

                if (statusId) {
                  orderStatusStatusId = statusId.value;
                }

                const orderId = _.find(item, (o) => o.key === 'order_id');

                if (orderId) {
                  orderStatusOrderId = orderId.value;
                }

                const code = _.find(item, (o) => o.key === 'code');

                if (code) {
                  orderStatusCode = code.value;
                }

                const sono = _.find(item, (o) => o.key === 'sono');

                if (sono) {
                  orderStatusSono = sono.value;
                }

                const statusName = _.find(item, (o) => o.key === 'status_name');

                if (statusName) {
                  orderStatusStatusName = statusName.value;
                }

                const isPaid = _.find(item, (o) => o.key === 'is_paid');

                if (isPaid) {
                  orderStatusIsPaid = isPaid.value;
                }

                const promotionName = _.find(item, (o) => o.key === 'promotion_name');

                if (promotionName) {
                  orderStatusPromotionName = promotionName.value;
                }

                const packageName = _.find(item, (o) => o.key === 'package_name');

                if (packageName) {
                  orderStatusPackageName = packageName.value;
                }

                const speed = _.find(item, (o) => o.key === 'speed');

                if (speed) {
                  orderStatusSpeed = speed.value;
                }

                const fullname = _.find(item, (o) => o.key === 'fullname');

                if (fullname) {
                  orderStatusFullname = fullname.value;
                }

                const filename = _.find(item, (o) => o.key === 'filename');

                if (filename) {
                  orderStatusFilename = filename.value;
                }

                const officeid = _.find(item, (o) => o.key === 'office_id');

                if (officeid) {
                  orderStatusOfficeId = officeid.value;
                }

                const costsetup = _.find(item, (o) => o.key === 'cost_setup');

                if (costsetup) {
                  orderStatusCostSetup = costsetup.value;
                }

                const costfee = _.find(item, (o) => o.key === 'cost_fee');

                if (costfee) {
                  orderStatusCostFee = costfee.value;
                }

                const costmaintenance = _.find(item, (o) => o.key === 'cost_maintenance');

                if (costmaintenance) {
                  orderStatusCostMaintenance = costmaintenance.value;
                }

                const costont = _.find(item, (o) => o.key === 'cost_ont');

                if (costont) {
                  orderStatusCostont = costont.value;
                }

                const costovercable = _.find(item, (o) => o.key === 'cost_over_cable');

                if (costovercable) {
                  orderStatusCostOverCable = costovercable.value;
                }

                const customermobile = _.find(item, (o) => o.key === 'customer_mobile');

                if (customermobile) {
                  orderStatusCustomerMobile = customermobile.value;
                }
                await this.updateTransactionRegisterService({ _id: transaction._id }, {
                  order_status_order_id: orderStatusOrderId,
                  order_status_code: orderStatusCode,
                  order_status_sono: orderStatusSono,
                  order_status_status_id: orderStatusStatusId,
                  order_status_status_name: orderStatusStatusName,
                  order_status_is_paid: orderStatusIsPaid,
                  order_status_promotion_name: orderStatusPromotionName,
                  order_status_package_name: orderStatusPackageName,
                  order_status_speed: orderStatusSpeed,
                  order_status_fullname: orderStatusFullname,
                  order_status_filename: orderStatusFilename,
                  order_status_office_id: orderStatusOfficeId,
                  order_status_cost_setup: orderStatusCostSetup,
                  order_status_cost_fee: orderStatusCostFee,
                  order_status_cost_maintenance: orderStatusCostMaintenance,
                  order_status_cost_ont: orderStatusCostont,
                  order_status_cost_over_cable: orderStatusCostOverCable,
                  order_status_customer_mobile: orderStatusCustomerMobile,
                });
              }
            }
          }
        }
      }
    } else {
      return { status: 400, message: 'Data not found.' };
    }
    return { status: 200, message: 'Success' };
  } catch (err) {
    return { status: 400, message: err.message };
  }
};

const createTransactionFindCenter = async (payload) => {
  try {
    const result = new TransactionFindCenter(payload);

    return result.save();
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const findTransactionFindCenter = async (payload) => {
  try {
    const result = TransactionFindCenter.findOne(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const deleteTransactionFindCenter = async (payload) => {
  try {
    const result = TransactionFindCenter.deleteMany(payload);

    return result;
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  findTransactionRegisterService,
  createTransactionRegisterService,
  updateTransactionRegisterService,
  createLeadForm,
  findMasterRegisterService,
  updateMasterRegisterService,
  getDetailRegisterService,
  getDetailMasterRegisterService,
  getSRList,
  updateOrderStatus,
  extractresultCheckOrderStatus,
  createTransactionFindCenter,
  findTransactionFindCenter,
  deleteTransactionFindCenter,
};
