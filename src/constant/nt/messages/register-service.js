const render = (datas) => {
  const arr = [];

  datas.forEach((data) => {
    if (data.type === 'uri') {
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
              type: 'text',
              text: data.title,
              size: 'md',
              weight: 'bold',
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
                uri: data.link,
              },
              style: 'secondary',
              height: 'sm',
              color: '#FFD100',
            },
          ],
          spacing: 'md',
        },
      });
    } else if (data.type === 'postback') {
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
              type: 'text',
              text: data.title,
              size: 'md',
              weight: 'bold',
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
                label: 'สมัครบริการ',
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
    }
  });

  return arr;
};

const registerService = (datas) => ({
  type: 'flex',
  altText: 'สมัครบริการ',
  contents: {
    type: 'carousel',
    contents: render(datas),
  },
});

export default registerService;
