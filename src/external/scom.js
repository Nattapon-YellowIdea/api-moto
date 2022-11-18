import soapRequest from 'easy-soap-request';
import { parseString } from 'xml2js';
import captureException from '../utils/captureException.js';

const getCominfoAllOffice = async (payload) => {
  const url = `${process.env.SCOM_URL}//ws/service.asmx`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
        <tem:GetCominfoAllOffice>         
        </tem:GetCominfoAllOffice>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const { response } = await soapRequest({ url, headers, xml });
    const { body, statusCode } = response;

    let data = {};
    parseString(body, {
      trim: true,
      normalizeTags: true,
      normalize: true,
      explicitCharkey: false,
      explicitRoot: false,
      explicitArray: false,
      ignoreAttrs: true,
      mergeAttrs: true,
      explicitChildren: true,
    }, (_err, results) => {
      data = JSON.parse(JSON.stringify(results));
    });

    return { status: statusCode, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getCominfoNearOfficeByLatLon = async (payload) => {
  const url = `${process.env.SCOM_URL}//ws/service.asmx`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:GetCominfoNearOfficeByLatLon>
        <tem:Lat>${payload.lat}</tem:Lat>
        <tem:Lon>${payload.lon}</tem:Lon>
        <tem:Distance>${payload.distance}</tem:Distance>
      </tem:GetCominfoNearOfficeByLatLon>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const { response } = await soapRequest({ url, headers, xml });
    const { body, statusCode } = response;

    let data = {};
    parseString(body, {
      trim: true,
      normalizeTags: true,
      normalize: true,
      explicitCharkey: false,
      explicitRoot: false,
      explicitArray: false,
      ignoreAttrs: true,
      mergeAttrs: true,
      explicitChildren: true,
    }, (_err, results) => {
      data = JSON.parse(JSON.stringify(results));
    });

    return { status: statusCode, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const getCominfoOfficeByLocation = async (payload) => {
  const url = `${process.env.SCOM_URL}//ws/service.asmx`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:GetCominfoOfficeByLocation>         
        <tem:location>${payload.location}</tem:location>
      </tem:GetCominfoOfficeByLocation>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const { response } = await soapRequest({ url, headers, xml });
    const { body, statusCode } = response;

    let data = {};
    parseString(body, {
      trim: true,
      normalizeTags: true,
      normalize: true,
      explicitCharkey: false,
      explicitRoot: false,
      explicitArray: false,
      ignoreAttrs: true,
      mergeAttrs: true,
      explicitChildren: true,
    }, (_err, results) => {
      data = JSON.parse(JSON.stringify(results));
    });

    return { status: statusCode, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  getCominfoAllOffice,
  getCominfoNearOfficeByLatLon,
  getCominfoOfficeByLocation,
};
