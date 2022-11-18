import { getDateDataTH } from '../../../utils/helper.js';

const payBillList = (billList, transactionRef, orderRef) => {
  const billFlexList = billList.detail.map((item) => {
    const payDate = `${getDateDataTH(item.paydate).date}/${getDateDataTH(item.paydate).monthNum}/${getDateDataTH(item.paydate).yearTH}`;

    return {
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
                text: 'เลขที่ใบเสร็จ',
                size: 'sm',
              },
              {
                type: 'text',
                text: item.receipt,
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
                text: 'วันที่ชำระ',
                size: 'sm',
              },
              {
                type: 'text',
                text: payDate,
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
                text: 'ประเภทชำระ',
                size: 'sm',
              },
              {
                type: 'text',
                text: billList.payment_method,
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
                text: item.amount,
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
              uri: `${process.env.LINE_LIFF_100}/ntplc/billing/slip/success?orderRefId=${orderRef}&transactionRef=${transactionRef}`,
              altUri: {
                desktop: `${process.env.LINE_LIFF_100}/ntplc/billing/slip/success?orderRefId=${orderRef}&transactionRef=${transactionRef}`,
              },
            },
            style: 'secondary',
            color: '#FFD100',
            height: 'sm',
          },
        ],
      },

    };
  });

  return {
    type: 'flex',
    altText: 'ใบบันทึกรายการ',
    contents: {
      type: 'carousel',
      contents: billFlexList,
    },
  };
};

export default payBillList;
