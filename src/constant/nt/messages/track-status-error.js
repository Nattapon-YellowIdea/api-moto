const trackStatusNotFound = (payload) => ({
  type: 'flex',
  altText: 'ติดตามสถานะการสมัคร',
  contents: {
    type: 'carousel',
    contents: [
      {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Frame-1369.png?w=1040`,
              size: '4xl',
              aspectMode: 'cover',
              aspectRatio: '9:4',
              gravity: 'top',
              align: 'end',
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะการสมัคร NT',
                  align: 'center',
                  size: '16px',
                  weight: 'bold',
                  gravity: 'center',
                  color: '#222222',
                },
              ],
              offsetTop: '25px',
              alignItems: 'center',
              position: 'absolute',
              offsetStart: '80px',
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `หมายเลขอ้างอิง ${payload.tracking_number}`,
                  align: 'center',
                  size: '14px',
                  weight: 'bold',
                  gravity: 'center',
                  color: '#545859',
                },
              ],
              offsetTop: '60px',
              alignItems: 'center',
              position: 'absolute',
              offsetStart: '54px',
            },
            {
              type: 'separator',
              margin: 'md',
            },
          ],
          paddingAll: '0px',
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'เกิดข้อผิดพลาดกรุณาติดต่อเจ้าหน้าที่',
              align: 'center',
              gravity: 'center',
            },
          ],
          paddingAll: 'xl',
        },
      },
    ],
  },
});

export default trackStatusNotFound;
