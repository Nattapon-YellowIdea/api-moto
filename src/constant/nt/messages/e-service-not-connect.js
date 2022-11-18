const eServiceNotConnect = () => ({
  type: 'flex',
  altText: 'ท่านยังไม่ได้เข้าระบบของเรา',
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
              text: 'กรุณาเข้าสู่ระบบ',
              align: 'center',
              weight: 'bold',
            },
            {
              type: 'text',
              text: 'NT eService',
              align: 'center',
              weight: 'bold',
            },
          ],
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Icons-Register2.png?w=1040`,
              size: 'md',
              aspectRatio: '1:1',
            },
          ],
          margin: 'md',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'เข้าสู่ระบบ',
              align: 'center',
              gravity: 'center',
              adjustMode: 'shrink-to-fit',
            },
          ],
          borderColor: '#FFD100',
          backgroundColor: '#FFFFFF',
          borderWidth: 'medium',
          cornerRadius: 'md',
          action: {
            type: 'message',
            label: 'เข้าสู่ระบบ',
            text: 'เข้าสู่ระบบ',
          },
          paddingAll: 'md',
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'สมัครสมาชิกใหม่',
              align: 'center',
              gravity: 'center',
              adjustMode: 'shrink-to-fit',
            },
          ],
          borderColor: '#FFD100',
          backgroundColor: '#FFD100',
          borderWidth: 'medium',
          cornerRadius: 'md',
          action: {
            type: 'uri',
            label: 'ลงทะเบียนใหม่',
            uri: `${process.env.LINE_LIFF_100}/ntplc/register`,
            altUri: {
              desktop: `${process.env.LINE_LIFF_100}/ntplc/register`,
            },
          },
          margin: 'lg',
          paddingAll: 'md',
        },
      ],
      backgroundColor: '#EFEFEF',
    },
  },
});

export default eServiceNotConnect;
