const registerServicePayForInstallation = () => ({
  type: 'flex',
  altText: 'ชำระเงินค่าติดตั้ง',
  contents: {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'ใบบันทึกรายการ',
              align: 'start',
              weight: 'bold',
              adjustMode: 'shrink-to-fit',
            },
            {
              type: 'image',
              url: `${process.env.S3_ENDPOINT_URL}/${process.env.MINIO_BUCKET_NAME}/icon/Logo.png?w=1040`,
              size: 'xs',
              align: 'end',
              gravity: 'top',
              aspectRatio: '5:4',
            },
          ],
          alignItems: 'center',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'เลขที่รายการอ้างอิง',
              size: 'sm',
            },
            {
              type: 'text',
              text: '0010155678',
              size: 'sm',
              align: 'end',
              weight: 'bold',
            },
          ],
          margin: 'xxl',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'วันที่ชำระ',
              size: 'sm',
            },
            {
              type: 'text',
              text: '10/01/2022',
              size: 'sm',
              align: 'end',
              weight: 'bold',
            },
          ],
          margin: 'lg',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'ช่องทางการชำระ',
              size: 'sm',
            },
            {
              type: 'text',
              text: 'Credit/Debit',
              size: 'sm',
              align: 'end',
              weight: 'bold',
            },
          ],
          margin: 'lg',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'ยอดชำระ',
              size: 'sm',
              weight: 'bold',
              flex: 3,
            },
            {
              type: 'text',
              text: '1,580,121.00',
              size: 'md',
              align: 'end',
              weight: 'bold',
              flex: 3,
              color: '#003294',
              gravity: 'center',
            },
            {
              type: 'text',
              text: 'บาท',
              size: 'xs',
              align: 'end',
              weight: 'bold',
              color: '#003294',
              gravity: 'center',
            },
          ],
          margin: 'xl',
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
            label: 'ใบบันทึกรายการ',
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

export default registerServicePayForInstallation;
