const render = (datas) => {
  const arr = [];

  datas.forEach((data) => {
    arr.push({
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
                wrap: true,
                text: `${data.location_name}`,
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
                url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Rich-Menu-Icon.png?w=1040`,
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
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'เวลาทำการ :',
                align: 'start',
                weight: 'regular',
                margin: 'none',
                size: 'sm',
                flex: 1,
              },
              {
                type: 'text',
                text: `จ.-ศ. เวลา ${data.time_finance} น.`,
                align: 'start',
                weight: 'regular',
                margin: 'none',
                flex: 2,
                size: 'sm',
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'โทร :',
                align: 'start',
                weight: 'regular',
                margin: 'none',
                size: 'sm',
                flex: 1,
              },
              {
                type: 'text',
                text: `${data.tel_information}`,
                align: 'start',
                weight: 'regular',
                margin: 'none',
                flex: 2,
                size: 'sm',
                action: {
                  type: 'uri',
                  label: 'Tel',
                  uri: `tel:${data.tel_information}`,
                },
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'image',
                url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Group-3931.png?w=1040`,
                aspectRatio: '30:12',
                action: {
                  type: 'uri',
                  label: 'location',
                  uri: `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`,
                },
              },
              {
                type: 'image',
                url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Group-3888.png?w=1040`,
                aspectRatio: '30:12',
                action: {
                  type: 'uri',
                  label: 'Tel',
                  uri: `tel:${data.tel_information}`,
                  altUri: {
                    desktop: `tel:${data.tel_information}`,
                  },
                },
              },
            ],
            margin: 'xxl',
          },
        ],
      },
    });
  });

  arr.push({
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
              text: 'ค้นหาศูนย์บริการเพิ่มเติม',
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
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Rich-Menu-Icon.png?w=1040`,
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
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ค้นหาศูนย์บริการเพิ่มเติม',
              align: 'center',
              weight: 'regular',
              margin: 'none',
            },
          ],
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'ดูศูนย์บริการทั้งหมด',
            uri: 'https://www.ntplc.co.th/Office/ServiceOffice',
            altUri: {
              desktop: 'https://www.ntplc.co.th/Office/ServiceOffice',
            },
          },
          style: 'secondary',
          color: '#FFD100',
          height: 'sm',
          margin: 'xxl',
        },
      ],
    },
  });

  return arr;
};

const findServiceCenter = (datas) => ({
  type: 'flex',
  altText: 'ค้นหาศูนย์บริการใกล้คุณ',
  contents: {
    type: 'carousel',
    contents: render(datas),
  },
});

export default findServiceCenter;
