import soapRequest from 'easy-soap-request';
import { parseString } from 'xml2js';
import captureException from '../utils/captureException.js';

const callBackListWeb = async (payload) => {
  const url = `${process.env.WSSCOMS_URL}/CallBackListWeb/Service.asmx`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:CallBackListWebType>
         <!--Optional:-->
         <tem:V_CALLBACKNUMBER>${payload.callbackNumber}</tem:V_CALLBACKNUMBER>
         <!--Optional:-->
         <tem:V_PHONENUMBER>${payload.phoneNumber}</tem:V_PHONENUMBER>
         <!--Optional:-->
         <tem:V_SERVICETYPE>${payload.serviceType}</tem:V_SERVICETYPE>
         <!--Optional:-->
         <tem:V_REASON>${payload.reason}</tem:V_REASON>
         <!--Optional:-->
         <tem:V_CallName>${payload.callName}</tem:V_CallName>
         <!--Optional:-->
         <tem:V_Memo>${payload.memo}</tem:V_Memo>
         <!--Optional:-->
         <tem:V_Email>${payload.email}</tem:V_Email>
         <!--Optional:-->
         <tem:wocode></tem:wocode>
         <!--Optional:-->
         <tem:type>99999911</tem:type>
         <!--Optional:-->
         <tem:faildate></tem:faildate>
      </tem:CallBackListWebType>
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

const getStatusByTicket = async (payload) => {
  const url = `${process.env.WSSCOMS_URL}/ServiceTrack2/ServiceTrack.asmx`;
  const headers = {
    'Content-Type': 'text/xml;',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
     <tem:GetStatusByTicket>
        <!--Optional:-->
        <tem:user>${payload.user}</tem:user>
        <!--Optional:-->
        <tem:pass>${payload.pass}</tem:pass>
        <!--Optional:-->
        <tem:ticket>${payload.ticket}</tem:ticket>
     </tem:GetStatusByTicket>
  </soapenv:Body>
</soapenv:Envelope>
  `;

  try {
    const { response } = await soapRequest({ url, headers, xml });
    const { body, statusCode } = response;

    let data = {};
    const bodySplit = body.split(']');

    data = `${bodySplit[0]}]`;

    return { data, statusCode };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

export default {
  callBackListWeb,
  getStatusByTicket,
};
