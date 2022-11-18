import Minio from 'minio';

export const GetFileExtentions = (img64) => {
  const dataImage = img64.match(/^data:image\/([a-zA-Z]*);base64,/);
  if (dataImage) {
    return dataImage[1];
  }
  const dataFile = img64.match(/^data:@file\/([a-zA-Z]*);base64,/);
  if (dataFile) {
    if (dataFile[1] === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    } if (dataFile[1] === 'octet-stream') {
      return 'xlsx';
    }
    return dataFile[1];
  }
  return '';
};

export const upload = (imgBase64 = '') => new Promise(((resolve) => {
  const key = GetFileExtentions(imgBase64);
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    // port: process.env.MINIO_PORT,
    // useSSL: process.env.MINIO_USE_SSL,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  });

  const bucket = process.env.MINIO_BUCKET_NAME;
  const params = {
    ContentType: '',
    ext: '',
    Metadata: '',
    Body: '',
  };

  if (key.search('png') > -1) {
    params.ContentType = 'image/png';
    params.ext = '.png';
    params.Metadata = { 'Content-Type': 'image/png' };
    params.Body = Buffer.from(imgBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  } else if (key.search('jpeg') > -1) {
    params.ContentType = 'image/jpeg';
    params.ext = '.jpeg';
    params.Metadata = { 'Content-Type': 'image/jpeg' };
    params.Body = Buffer.from(imgBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  } else if (key.search('pdf') > -1) {
    params.ContentType = 'application/pdf';
    params.ext = '.pdf';
    params.Metadata = { 'Content-Type': 'application/pdf' };
    const fileWithoutMimeType = imgBase64.match(/,(.*)$/)[1];
    params.Body = Buffer.from(fileWithoutMimeType, 'base64');
  } else if (key.search('docx') > -1) {
    params.ContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    params.ext = '.docx';
    const fileWithoutMimeType = imgBase64.match(/,(.*)$/)[1];
    params.Body = Buffer.from(fileWithoutMimeType, 'base64');
  } else if (key.search('xlsx') > -1) {
    params.ContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    params.ext = '.xlsx';
    const fileWithoutMimeType = imgBase64.match(/,(.*)$/)[1];
    params.Body = Buffer.from(fileWithoutMimeType, 'base64');
  } else if (key.search('mp4') > -1) {
    params.ContentType = 'video/mp4';
    params.ext = '.mp4';
    const fileWithoutMimeType = imgBase64.match(/,(.*)$/)[1];
    params.Body = Buffer.from(fileWithoutMimeType, 'base64');
  } else if (key.search('quicktime') > -1) {
    params.ContentType = 'video/mp4';
    params.ext = '.quicktime';
    const fileWithoutMimeType = imgBase64.match(/,(.*)$/)[1];
    params.Body = Buffer.from(fileWithoutMimeType, 'base64');
  }
  const date = new Date();
  date.setHours(date.getHours() + 7);
  const today = (`00${date.getMonth() + 1}`).slice(-2)
    + (`00${date.getDate()}`).slice(-2)
    + date.getFullYear()
    + (`00${date.getHours()}`).slice(-2)
    + (`00${date.getMinutes()}`).slice(-2)
    + (`00${date.getSeconds()}`).slice(-2);
  const filename = today + params.ext;

  minioClient.putObject(bucket, filename, params.Body, (err) => {
    if (err) {
      resolve(false);
    }
    resolve(`${process.env.S3_ENDPOINT_URL}/${bucket}/${filename}`);
  });
}));

export default upload;
