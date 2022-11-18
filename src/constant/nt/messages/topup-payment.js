const topupPayment = (data) => ({
  type: 'flex',
  altText: 'ใบบันทึกรายการ',
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
              text: 'หมายเลขบริการ',
              size: 'sm',
            },
            {
              type: 'text',
              text: `${data.mobile}`,
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
              text: 'เลขที่รายการอ้างอิง',
              size: 'sm',
            },
            {
              type: 'text',
              text: `${data.transactionRef}`,
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
              text: 'เลขที่ใบเสร็จ',
              size: 'sm',
            },
            {
              type: 'text',
              text: `${data.invoiceno}`,
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
              text: 'ช่องทางการชำระ',
              size: 'sm',
            },
            {
              type: 'text',
              text: `${data.paymentMethod}`,
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
              text: `${data.total}`,
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
            uri: `${process.env.LINE_LIFF_100}/topup/payment/slip?orderRefId=${data.order_ref}`,
            altUri: {
              desktop: `${process.env.LINE_LIFF_100}/topup/payment/slip?orderRefId=${data.order_ref}`,
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

export default topupPayment;
