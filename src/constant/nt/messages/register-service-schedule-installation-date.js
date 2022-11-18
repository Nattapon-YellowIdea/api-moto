const registerServicePayForInstallation = (orderCode) => ({
  type: 'flex',
  altText: 'ชำระเงินค่าติดตั้ง',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'เลือกวันนัดหมายติดตั้ง',
              align: 'center',
            },
          ],
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Icons-Apply-Product.png?w=1040`,
              size: 'md',
              aspectRatio: '1:1',
            },
          ],
          margin: 'md',
        },
        {
          type: 'separator',
          margin: 'md',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'เลือกวันนัดหมาย',
            uri: `${process.env.LINE_LIFF_100}/register/appointment?order_code=${orderCode}`,
            altUri: {
              desktop: `${process.env.LINE_LIFF_100}/register/appointment?order_code=${orderCode}`,
            },
          },
          style: 'secondary',
          color: '#FFD100',
          height: 'sm',
        },
      ],
    },
  },
});

export default registerServicePayForInstallation;
