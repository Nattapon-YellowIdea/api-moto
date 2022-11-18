import { numberCommaWith2digit } from '../../../utils/helper.js';

const createBillList = (item) => {
  const sumAll = numberCommaWith2digit(item.billList.reduce((sum, itm) => sum + itm.unpaid_amount, 0));
  const oneBillSum = numberCommaWith2digit(item.unpaid_amount);
  const billListDetail = [];

  if (item.billList.length > 1) {
    billListDetail.push(
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
            text: `${item.billList.length === 0 ? oneBillSum : sumAll}`,
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
    );
  }

  if (item.billList.length === 0) {
    billListDetail.push(
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
            text: `${item.billList.length === 0 ? oneBillSum : sumAll}`,
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
    );
  }

  return billListDetail;
};

const eServiceCheckBalance = (objFlex) => {
  const MainFlexReturn = {
    type: 'flex',
    altText: 'สรุปค่าใช้บริการ',
    contents: {
      type: 'carousel',
    },
  };

  const carouselContent = [];

  objFlex.forEach((item) => {
    if (!item.billList) {
      carouselContent.push({
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: 'https://i.ibb.co/SmcdnJ7/Group-7315.png',
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
                  text: 'สรุปค่าใช้บริการ',
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
                  text: `ชื่อบัญชีลูกค้า ${item.fullName}`,
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
                  text: `รหัสลูกค้า ${item.serviceno}`,
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
                  text: `หมายเลขบริการ ${item.serviceid}`,
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
              type: 'separator',
              margin: 'md',
            },
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
          ],
          paddingAll: '0px',
        },
      });
    } else {
      carouselContent.push({
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: 'https://i.ibb.co/SmcdnJ7/Group-7315.png',
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
                  text: 'สรุปค่าใช้บริการ',
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
                  text: `ชื่อบัญชีลูกค้า ${item.fullName}`,
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
                  text: `รหัสลูกค้า ${item.serviceno}`,
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
                  text: `หมายเลขบริการ ${item.serviceid}`,
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
              type: 'separator',
              margin: 'md',
            },
            {
              type: 'box',
              layout: 'vertical',
              contents: !item.billList ? [] : createBillList(item),
              paddingAll: '0px',
            },
          ],
          paddingAll: '0px',
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: 'จ่ายบิล',
                uri: `${process.env.LINE_LIFF_100}/ntplc/pay-billing?ba=${item.serviceno}`,
                altUri: {
                  desktop: `${process.env.LINE_LIFF_100}/ntplc/pay-billing?ba=${item.serviceno}`,
                },
              },
              style: 'secondary',
              color: '#FFD100',
              height: 'sm',
              margin: 'md',
            },
          ],
          margin: 'lg',
        },
      });
    }
  });

  MainFlexReturn.contents.contents = carouselContent;

  return MainFlexReturn;
};

export default eServiceCheckBalance;
