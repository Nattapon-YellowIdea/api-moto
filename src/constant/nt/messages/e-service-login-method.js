const eServiceLoginMethod = () => ({
  type: 'imagemap',
  baseUrl: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/H1CIkt.png?w=1040`,
  altText: 'เข้าสู่ระบบทันที',
  baseSize: {
    width: 1040,
    height: 475,
  },
  actions: [
    {
      type: 'uri',
      area: {
        x: 19,
        y: 107,
        width: 504,
        height: 352,
      },
      linkUri: `${process.env.LINE_LIFF_100}/ntplc/login/email`,
    },
    {
      type: 'uri',
      area: {
        x: 539,
        y: 107,
        width: 476,
        height: 349,
      },
      linkUri: `${process.env.LINE_LIFF_100}/ntplc/login/phone-number`,
    },
  ],
});

export default eServiceLoginMethod;
