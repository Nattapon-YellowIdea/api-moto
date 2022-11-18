import topupController from '../../../controllers/topup.controller.js';

async function handleEvent(event) {
  try {
    return Promise.all([
      topupController.updateAfterPayment(event),
    ]);
  } catch (err) {
    return Promise.reject(err);
  }
}

const noti = async (msg) => {
  const data = JSON.parse(msg.content);
  return Promise.all([handleEvent(data)]);
};

export default noti;
