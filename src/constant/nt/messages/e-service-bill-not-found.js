const eServiceCheckBillNotFound = (objFlex) => ({
  type: 'flex',
  altText: 'ไม่พบยอดต้างชำระในระบบ',
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
              text: 'รายการค่าบริการ',
              size: '14px',
              weight: 'bold',
              color: '#222222',
            },
          ],
          margin: 'lg',
          paddingStart: 'xl',
          paddingEnd: 'xl',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: objFlex.fullName,
              size: '14px',
              weight: 'bold',
              color: '#222222',
              adjustMode: 'shrink-to-fit',
            },
          ],
          margin: 'lg',
          paddingStart: 'xl',
          paddingEnd: 'xl',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: `หมายเลขบริการ ${objFlex.serviceno}`,
              size: '14px',
              weight: 'bold',
              color: '#222222',
              adjustMode: 'shrink-to-fit',
            },
          ],
          margin: 'sm',
          paddingStart: 'xl',
          paddingEnd: 'xl',
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'มียอดค่าใช้บริการทั้งสิ้น',
                  size: '14px',
                  weight: 'bold',
                  flex: 5,
                  adjustMode: 'shrink-to-fit',
                },
                {
                  type: 'text',
                  text: '0.00',
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
              paddingStart: 'xl',
              paddingEnd: 'xl',
            },
            {
              type: 'separator',
              margin: 'md',
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: [],
              margin: 'lg',
              paddingStart: 'xl',
              paddingEnd: 'xl',
            },
          ],
          paddingAll: '0px',
        },
      ],
      paddingAll: '0px',
    },
  },
});

export default eServiceCheckBillNotFound;
