const eServiceCheckAndPay = () => ({
  type: 'imagemap',
  baseUrl: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Group73081.png?w=1040`,
  altText: 'เช็กยอด/จ่ายบิล',
  baseSize: {
    width: 1040,
    height: 461,
  },
  actions: [
    {
      type: 'message',
      area: {
        x: 7,
        y: 101,
        width: 341,
        height: 360,
      },
      text: 'เช็กยอด',
    },
    {
      type: 'uri',
      area: {
        x: 354,
        y: 101,
        width: 336,
        height: 360,
      },
      linkUri: `${process.env.LINE_LIFF_100}/ntplc/billing`,
    },
    {
      type: 'uri',
      area: {
        x: 697,
        y: 102,
        width: 343,
        height: 359,
      },
      linkUri: `${process.env.LINE_LIFF_100}/ntplc/service`,
    },
  ],
});

export default eServiceCheckAndPay;
