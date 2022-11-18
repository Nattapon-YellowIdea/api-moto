const eServiceSelectService = () => ({
  type: 'imagemap',
  baseUrl: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/H1CMEe.png?w=1040`,
  altText: 'ท่านต้องการเข้าใช้บริการใด',
  baseSize: {
    width: 1040,
    height: 475,
  },
  actions: [
    {
      type: 'message',
      text: 'เช็กยอด/จ่ายบิล',
      area: {
        x: 19,
        y: 107,
        width: 504,
        height: 352,
      },
    },
    {
      type: 'uri',
      area: {
        x: 539,
        y: 107,
        width: 476,
        height: 349,
      },
      linkUri: `${process.env.LINE_LIFF_100}/ntplc/service`,
    },
  ],
});

export default eServiceSelectService;
