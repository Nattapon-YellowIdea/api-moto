export const base64Encrypt = (payload) => {
  const result = Buffer.from(payload).toString('base64');
  return result;
};

export const base64Decrypt = (payload) => {
  const result = Buffer.from(payload, 'base64').toString();
  return result;
};

export const doubleBase64Encrypt = (payload) => {
  const base64 = Buffer.from(payload).toString('base64');
  const result = Buffer.from(base64).toString('base64');
  return result;
};

export const doubleBase64Decrypt = (payload) => {
  const base64 = Buffer.from(payload, 'base64').toString();
  const text = Buffer.from(base64, 'base64').toString();
  return text;
};


