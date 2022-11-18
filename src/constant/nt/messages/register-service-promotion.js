const render = (datas) => {
  const arr = [];

  datas.forEach((data) => {
    arr.push({
      type: 'bubble',
      hero: {
        type: 'image',
        url: data.img_url,
        aspectRatio: '20:13',
        size: 'full',
        aspectMode: 'cover',
      },
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
                text: data.title,
                size: 'md',
                weight: 'bold',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: data.display_description,
                wrap: true,
                size: 'sm',
                margin: 'md',
              },
            ],
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: data.display_price,
                align: 'end',
                size: 'lg',
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
              type: 'postback',
              label: 'เลือก',
              data: data.data,
              displayText: data.display_text,
            },
            style: 'secondary',
            height: 'sm',
            color: '#FFD100',
          },
        ],
        spacing: 'md',
      },
    });
  });

  return arr;
};

const registerServicePromotion = (datas) => ({
  type: 'flex',
  altText: 'เลือก Promotion',
  contents: {
    type: 'carousel',
    contents: render(datas),
  },
});

export default registerServicePromotion;
