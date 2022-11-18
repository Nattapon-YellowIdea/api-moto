const findServiceCenter = () => ({
  type: 'flex',
  altText: 'ค้นหาศูนย์บริการใกล้คุณ',
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
              type: 'image',
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Icons-Apply-Product.png?w=1040`,
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
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'ค้นหาศูนย์บริการใกล้คุณ',
            uri: 'https://line.me/R/nv/location/',
            altUri: {
              desktop: 'https://line.me/R/nv/location/',
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

export default findServiceCenter;
