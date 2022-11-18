import moment from 'moment-timezone';
import soapRequest from 'easy-soap-request';
import { parseString } from 'xml2js';
import captureException from '../utils/captureException.js';
import requestResponseExternalservice from '../services/requestResponseExternal.service.js';
import { timeDiffCalc } from '../utils/helper.js';

const crmQueryCaForAllPs = async (payload) => {
  const datenowBefore = moment.tz(new Date(), 'Asia/Bangkok');
  const url = `${process.env.CRM_URL}/TOTBilling/ProxyServices/CRM/CRM_QueryCAforAll_PS?wsdl`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:crm="http://totbilling.tot.co.th/esb/wsdl/CRM/CRM_QueryCAforAll" xmlns:com="http://totbilling.tot.co.th/esb/common-integrated" xmlns:crm1="http://totbilling.tot.co.th/esb/xsd/CRM/CRM_QueryCAforAll">
    <soapenv:Header/>
    <soapenv:Body>
      <crm:CRM_QueryCAforAll_PS>
        <CRM_QueryCAforAll_PSRequest>
          <com:contextIntegrator>
            <com:header>
              <com:transactionId>${payload.transactionId}</com:transactionId>
              <com:integrationKeyRef>${payload.integrationKeyRef}</com:integrationKeyRef>
            </com:header>
            <com:message>
              <com:integrationResult>
                <com:result>false</com:result>
                <com:esbReturnCode>string</com:esbReturnCode>
                <com:esbReturnMsg>string</com:esbReturnMsg>
                <com:destinationReturnCode>string</com:destinationReturnCode>
                <com:destinationReturnMsg>string</com:destinationReturnMsg>
              </com:integrationResult>
            </com:message>
          </com:contextIntegrator>
          <crm1:body>
            <crm1:citizenId>${(payload.IsCitizenId === 1) ? payload.personalId : ''}</crm1:citizenId>
            <crm1:RegistrationID/>
            <crm1:PassportNo>${(payload.IsCitizenId === 1) ? '' : payload.personalId}</crm1:PassportNo>
            <crm1:CA_TaxID/>
            <crm1:assetNo/>
            <crm1:BA_ID/>
            <crm1:CA_ID/>
            <crm1:CA_all>true</crm1:CA_all>
            <crm1:BA_allStatus>true</crm1:BA_allStatus>
            <crm1:Asset_allStatus>true</crm1:Asset_allStatus>
            <crm1:BA_Asset_All>true</crm1:BA_Asset_All>
          </crm1:body>
        </CRM_QueryCAforAll_PSRequest>
      </crm:CRM_QueryCAforAll_PS>
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
    const datenowAfter = moment.tz(new Date(), 'Asia/Bangkok');

    await requestResponseExternalservice.createTransactionRequestResponseExternal({
      service: 'crmExternal',
      function: 'crmQueryCaForAllPs',
      start: datenowBefore,
      stop: datenowAfter,
      time_diff: timeDiffCalc(datenowBefore, datenowAfter),
      line_user_id: payload.line_user_id,
    });

    return { status: statusCode, data };
  } catch (err) {
    captureException(payload);
    throw err;
  }
};

const crmQueryBaPs = async (payload) => {
  const url = `${process.env.CRM_URL}/TOTBilling/ProxyServices/RBM/RBM_QueryBA_PS?wsdl`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:new="http://new.webservice.namespace" xmlns:com="http://totbilling.tot.co.th/esb/common-integrated" xmlns:acc="http://totbilling.tot.co.th/esb/rbm/account">
    <soapenv:Header/>
    <soapenv:Body>
      <new:QueryBA_PS>
        <QueryBARequest>
          <com:contextIntegrator>
            <com:header>
              <com:transactionId>${payload.transactionId}</com:transactionId>
              <com:integrationKeyRef>${payload.integrationKeyRef}</com:integrationKeyRef>
            </com:header>
            <com:message>
              <com:integrationResult>
                <com:result></com:result>
                <com:esbReturnCode></com:esbReturnCode>
                <com:esbReturnMsg></com:esbReturnMsg>
                <com:destinationReturnCode></com:destinationReturnCode>
                <com:destinationReturnMsg></com:destinationReturnMsg>
              </com:integrationResult>
            </com:message>
          </com:contextIntegrator>
          <acc:body>
            <acc:billingAccountId>${payload.billingAccountId}</acc:billingAccountId>
          </acc:body>
        </QueryBARequest>
      </new:QueryBA_PS>
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

const crmQueryBillSummaryForLatestDebtPS = async (payload) => {
  const url = `${process.env.CRM_URL}/TOTBilling/ProxyServices/RBM/RBM_QueryBillSummaryForLatestDebt_PS?wsdl`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rbm="http://totbilling.tot.co.th/esb/wsdl/RBM/RBMQueryBillSummaryForLatestDebt" xmlns:com="http://totbilling.tot.co.th/esb/common-integrated" xmlns:rbm1="http://totbilling.tot.co.th/esb/xsd/RBM/RBMQueryBillSummaryForLatestDebt">
    <soapenv:Header/>
    <soapenv:Body>
      <rbm:RBMQueryBillSummaryForLatestDebt_PS>
        <RBMQueryBillSummaryForLatestDebt_PSRequest>
          <com:contextIntegrator>
            <com:header>
              <com:transactionId>${payload.transactionId}</com:transactionId>
              <com:integrationKeyRef>${payload.integrationKeyRef}</com:integrationKeyRef>
            </com:header>
            <com:message>
              <com:integrationResult>
                <com:result>false</com:result>
                <com:esbReturnCode/>
                <com:esbReturnMsg/>
                <com:destinationReturnCode/>
                <com:destinationReturnMsg/>
              </com:integrationResult>
            </com:message>
          </com:contextIntegrator>
          <rbm1:body>
            <rbm1:accountNum>${payload.accountNum}</rbm1:accountNum>
          </rbm1:body>
        </RBMQueryBillSummaryForLatestDebt_PSRequest>
      </rbm:RBMQueryBillSummaryForLatestDebt_PS>
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

const crmQueryAllInvoicePS = async (payload) => {
  const url = `${process.env.CRM_URL}/TOTBilling/ProxyServices/RBM/RBM_QueryAllInvoice_PS?wsdl`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bill="http://totbilling.tot.co.th/esb/services/rbm/bill" xmlns:com="http://totbilling.tot.co.th/esb/common-integrated" xmlns:bill1="http://totbilling.tot.co.th/esb/xsd/rbm/bill">
    <soapenv:Header/>
    <soapenv:Body>
      <bill:queryAllInvoice>
        <queryInvoiceRequest>
          <com:contextIntegrator>
            <com:header>
              <com:transactionId>${payload.transactionId}</com:transactionId>
              <com:integrationKeyRef>${payload.integrationKeyRef}</com:integrationKeyRef>
            </com:header>
            <com:message>
              <com:integrationResult>
                <com:result/>
                <com:esbReturnMsg/>
                <com:destinationReturnCode/>
                <com:destinationReturnMsg/>
              </com:integrationResult>
            </com:message>
          </com:contextIntegrator>
          <bill1:billingAccountId>${payload.billingAccountId}</bill1:billingAccountId>
          <bill1:billSeq/>
          <bill1:discardTruncated>true</bill1:discardTruncated>
          <bill1:maxRows>${payload.maxRows}</bill1:maxRows>
        </queryInvoiceRequest>
      </bill:queryAllInvoice>
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
  crmQueryCaForAllPs,
  crmQueryBaPs,
  crmQueryBillSummaryForLatestDebtPS,
  crmQueryAllInvoicePS,
};
