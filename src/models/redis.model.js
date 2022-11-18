import moment from 'moment';
import { fnDateAddHours } from '../utils/helper.js';

const getKeywordMatch = async (data, msg) => {
  let keyword;
  data.forEach((v) => {
    if (v.is_active === true) {
      if (v.scheduling === 'always') {
        if (v.use_keywords === true) {
          v.keywords.forEach((k) => {
            if (k === msg) {
              keyword = v;
            }
          });
        }
      } else if (v.scheduling === 'scheduling') {
        const now = moment(fnDateAddHours(7));
        const startDate = moment(v.start_date);
        const endDate = moment(v.end_date);

        const duration = moment(now).isBetween(startDate, endDate);

        const d = new Date();
        const day = d.getDay();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const aday = dayOfWeek[day];

        if (duration === true) {
          if (v.scheduling_date === 'Every day') {
            if (v.use_keywords === true) {
              v.keywords.forEach((k) => {
                if (k === msg) {
                  keyword = v;
                }
              });
            }
          } else if (v.scheduling_date === aday) {
            if (v.use_keywords === true) {
              v.keywords.forEach((k) => {
                if (k === msg) {
                  keyword = v;
                }
              });
            }
          }
        }
      }
    }
  });

  return keyword;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getKeywordMatch,
};
