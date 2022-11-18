const registerServiceTopic = () => ({
  type: 'flex',
  altText: 'กรุณาเลือกช่องทางการสมัครที่ต้องการ',
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
              text: 'กรุณาเลือกช่องทางการสมัครที่ต้องการ',
              align: 'center',
              gravity: 'center',
            },
          ],
          alignItems: 'center',
          margin: 'lg',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'image',
                  url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Group-3896.png?w=1040`,
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '150:98',
                  gravity: 'center',
                  action: {
                    type: 'postback',
                    label: 'action',
                    data: 'action=broadband&layer=2&data=agent_chat',
                    text: 'แชทกับเจ้าหน้าที่',
                  },
                },
                {
                  type: 'image',
                  url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Group-3897.png?w=1040`,
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '150:98',
                  gravity: 'center',
                  action: {
                    type: 'postback',
                    label: 'action',
                    data: 'action=broadband&layer=2&data=online_self_service',
                    displayText: 'สมัครบริการออนไลน์',
                  },
                },
              ],
              flex: 1,
            },
          ],
          margin: 'xl',
        },
      ],
      paddingAll: '0px',
    },
  },
});

export default registerServiceTopic;
