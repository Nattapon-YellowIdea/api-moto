const eServiceCheckBalanceBANotFound = () => ({
  type: 'flex',
  altText: 'ไม่พบหมายเลขบริการในระบบ',
  contents: {

    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Frame-4444.png?w=1040`,
          size: 'full',
          align: 'end',
          gravity: 'top',
          aspectRatio: '293:64',
          aspectMode: 'cover',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'ไม่พบหมายเลขบริการในระบบ',
              size: '14px',
              weight: 'bold',
              color: '#222222',
            },
          ],
          margin: 'xxl',
          paddingStart: 'xl',
          paddingEnd: 'xl',
        },
      ],
      paddingAll: '0px',
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'เพิ่มหมายเลขบริการ',
            uri: `${process.env.LINE_LIFF_100}/ntplc/service`,
            altUri: {
              desktop: `${process.env.LINE_LIFF_100}/ntplc/service`,
            },
          },
          style: 'secondary',
          color: '#FFD100',
          height: 'sm',
          margin: 'md',
        },
      ],
      margin: 'lg',
    },
  },
});

export default eServiceCheckBalanceBANotFound;
