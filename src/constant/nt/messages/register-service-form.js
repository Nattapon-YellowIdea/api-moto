const registerServiceForm = (transaction) => ({
  type: 'flex',
  altText: 'สมัครบริการ',
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
              text: 'พื้นที่ของท่านสามารถให้บริการได้',
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
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/share-location-register.png?w=1040`,
              size: 'md',
              aspectRatio: '1:1',
            },
          ],
          margin: 'md',
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ท่านสามารถติดตั้งบริการของ NT ได้',
              size: 'sm',
              align: 'center',
            },
          ],
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
            label: 'สมัครบริการ',
            uri: `${process.env.LINE_LIFF_100}/register/broadband/user-check?id=${transaction._id}`,
            altUri: {
              desktop: `${process.env.LINE_LIFF_100}/register/broadband/user-check?id=${transaction._id}`,
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

export default registerServiceForm;
