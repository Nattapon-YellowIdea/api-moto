const accessService = () => ({
  type: 'imagemap',
  baseUrl: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/8LiRsE.png?w=1040`,
  altText: 'สมัครบริการ/ติดตามสถานะ/ชำระค่าติดตั้ง',
  baseSize: {
    width: 1040,
    height: 475,
  },
  actions: [
    {
      type: 'message',
      area: {
        x: 21,
        y: 114,
        width: 323,
        height: 361,
      },
      text: 'สมัครบริการ',
    },
    {
      type: 'uri',
      area: {
        x: 347,
        y: 114,
        width: 356,
        height: 361,
      },
      linkUri: `${process.env.LINE_LIFF_80}`,
    },
    {
      type: 'uri',
      area: {
        x: 707,
        y: 112,
        width: 333,
        height: 363,
      },
      linkUri: `${process.env.LINE_LIFF_100}/register/payment`,
    },
  ],
});

export default accessService;
