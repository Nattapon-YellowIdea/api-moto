export const replaceID = (obj) => JSON.parse(JSON.stringify(obj).replace(/"_id"/g, '"id"'));
export const fnDateAddHours = (number) => new Date().addHours(number);
export const strNumToDec = (strNum) => {
  if (strNum === '' || strNum === '0') return 0;
  return parseFloat((parseInt(strNum, 10) / 10000000));
};
const MONTH_TH_MINI = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
export const getDateDataTH = (strDateTime) => {
  const date = new Date(strDateTime);
  if (strDateTime === '' || !strDateTime) return null;
  return {
    yearTH: date.getFullYear() + 543,
    monthNum: (date.getMonth() + 1).toString().length === 1 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1,
    monthTH: MONTH_TH_MINI[date.getMonth()],
    date: date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString(),
  };
};
export const numberCommaWith2digit = (number) => {
  if (!number) return '0';
  return number.toLocaleString(undefined, { minimumFractionDigits: 2 });
};
export const generate6DigitNumberString = () => {
  const number = Math.floor(100000 + Math.random() * 900000);
  return number.toString();
};
export const generateRandomStringByLength = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
      * charactersLength));
  }
  return result;
};
export const isNotNullAndNotEmpty = (obj) => (obj ? obj !== '' : false);

export const timeDiffCalc = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days} day, ` : `${days} days, `;
  }

  difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

  difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

  return difference;
};

const replaceStringWithX = (str, startPosition) => str.substring(0, startPosition) + str.substring(startPosition).replaceAll(/[^a-zA-Z0-9]/g, 'x');

export const billingFullName = (fullName, tier) => {
  let fullNameWithX = '';

  const arrPrefix = ['นาย', 'นางสาว', 'นาง', 'น.ส.', 'น.ส', 'คุณ', 'mr.', 'mrs.', 'miss.', 'mr', 'mrs', 'miss'];

  const fullNameSplit = fullName.replaceAll('|', ' ').split(' ');

  const findEmpty = fullNameSplit.filter((el) => el !== '');

  const foundPrefix = arrPrefix.find((item) => item === findEmpty[0]);

  if (foundPrefix !== undefined) { fullNameSplit.splice(0, 1); }

  const removePrefix = findEmpty.filter((item) => item !== foundPrefix);

  if (removePrefix[0]) {
    fullNameWithX += replaceStringWithX(removePrefix[0], 3);
  }

  if (removePrefix[1]) {
    fullNameWithX += ` ${replaceStringWithX(removePrefix[1], 3)}`;
  }

  if (tier !== 3) {
    return fullNameWithX;
  }

  return `${removePrefix[0]} ${removePrefix[1]}`;
};
