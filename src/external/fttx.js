import soapRequest from 'easy-soap-request';
import { parseString } from 'xml2js';
import captureException from '../utils/captureException.js';

const getSearchDpOnArea = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WebServiceControllerwsdl">
    <soapenv:Header/>
    <soapenv:Body>
      <urn:getSearchDpOnArea soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:lat>${payload.lat}</tem:lat>
        <tem:lng>${payload.lng}</tem:lng>
        <tem:dp_test>${payload.dp_test}</tem:dp_test>
        <tem:village>${payload.village}</tem:village>
        <tem:subdistrict>${payload.subdistrict}</tem:subdistrict>
        <tem:district_id>${payload.district_id}</tem:district_id>
        <tem:province_id>${payload.province_id}</tem:province_id>
      </urn:getSearchDpOnArea>
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

const getCreateOrdersNew = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:getCreateOrdersNew>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:customer_code>${payload.customer_code}</tem:customer_code>
        <tem:national_identity>${payload.personal_id}</tem:national_identity>
        <tem:customer_sex>${payload.customer_sex}</tem:customer_sex>
        <tem:customer_title>${payload.customer_title}</tem:customer_title>
        <tem:customer_first_name>${payload.customer_first_name}</tem:customer_first_name>
        <tem:customer_last_name>${payload.customer_last_name}</tem:customer_last_name>
        <tem:customer_address>${payload.customer_address}</tem:customer_address>
        <tem:customer_no>${payload.customer_no}</tem:customer_no>
        <tem:customer_village>${payload.customer_village}</tem:customer_village>
        <tem:customer_building>${payload.customer_building}</tem:customer_building>
        <tem:customer_moo>${payload.customer_moo}</tem:customer_moo>
        <tem:customer_soi>${payload.customer_soi}</tem:customer_soi>
        <tem:customer_road>${payload.customer_road}</tem:customer_road>
        <tem:customer_subdistrict>${payload.customer_subdistrict}</tem:customer_subdistrict>
        <tem:customer_district_id>${payload.customer_district_id}</tem:customer_district_id>
        <tem:customer_province_id>${payload.customer_province_id}</tem:customer_province_id>
        <tem:customer_zip>${payload.customer_zip}</tem:customer_zip>
        <tem:customer_lat_lon>${payload.customer_lat_lon}</tem:customer_lat_lon>
        <tem:customer_birthday_2>${payload.customer_birthday_2}</tem:customer_birthday_2>
        <tem:customer_email>${payload.customer_email}</tem:customer_email>
        <tem:customer_phoneno>${payload.customer_phoneno}</tem:customer_phoneno>
        <tem:customer_mobile>${payload.customer_mobile}</tem:customer_mobile>
        <tem:customer_customer_type_id>${payload.customer_customer_type_id}</tem:customer_customer_type_id>
        <tem:order_address>${payload.order_address}</tem:order_address>
        <tem:order_no>${payload.order_no}</tem:order_no>
        <tem:order_village>${payload.order_village}</tem:order_village>
        <tem:order_building>${payload.order_building}</tem:order_building>
        <tem:order_moo>${payload.order_moo}</tem:order_moo>
        <tem:order_soi>${payload.order_soi}</tem:order_soi>
        <tem:order_road>${payload.order_road}</tem:order_road>
        <tem:order_subdistrict>${payload.order_subdistrict}</tem:order_subdistrict>
        <tem:order_district_id>${payload.order_district_id}</tem:order_district_id>
        <tem:order_province_id>${payload.order_province_id}</tem:order_province_id>
        <tem:order_postcode>${payload.order_postcode}</tem:order_postcode>
        <tem:order_lat_lon>${payload.order_lat_lon}</tem:order_lat_lon>
        <tem:order_office_id>${payload.order_office_id}</tem:order_office_id>
        <tem:order_office_id_device>${payload.order_office_id_device}</tem:order_office_id_device>
        <tem:order_office_id_number>${payload.order_office_id_number}</tem:order_office_id_number>
        <tem:order_office_id_sale>${payload.order_office_id_sale}</tem:order_office_id_sale>
        <tem:order_exchange_id>${payload.order_exchange_id}</tem:order_exchange_id>
        <tem:order_device_id>${payload.order_device_id}</tem:order_device_id>
        <tem:order_position>${payload.order_position}</tem:order_position>
        <tem:order_distance_estimated>${payload.order_distance_estimated}</tem:order_distance_estimated>
        <tem:crm_id>${payload.crm_id}</tem:crm_id>
        <tem:order_promotion_id>${payload.order_promotion_id}</tem:order_promotion_id>
        <tem:order_package_id>${payload.order_package_id}</tem:order_package_id>
        <tem:order_speed_id>${payload.order_speed_id}</tem:order_speed_id>
        <tem:order_status_id>${payload.order_status_id}</tem:order_status_id>
        <tem:ref_id>${payload.ref_id}</tem:ref_id>
        <tem:cost_maintenance>${payload.cost_maintenance}</tem:cost_maintenance>
        <tem:cost_setup>${payload.cost_setup}</tem:cost_setup>
        <tem:cost_fee>${payload.cost_fee}</tem:cost_fee>
        <tem:cost_over_cable>${payload.cost_over_cable}</tem:cost_over_cable>
        <tem:cost_ont>${payload.cost_ont}</tem:cost_ont>
        <tem:ont_int>${payload.ont_int}</tem:ont_int>
        <tem:ca>${payload.ca}</tem:ca>
        <tem:permission_place>${payload.permission_place}</tem:permission_place>
        <tem:polyline>${payload.polyline}</tem:polyline>
        <tem:speed>${payload.speed}</tem:speed>
        <tem:service_name>${payload.service_name}</tem:service_name>
        <tem:dealer_id>${payload.dealer_id}</tem:dealer_id>
        <tem:date_time_eservice>${payload.date_time_eservice}</tem:date_time_eservice>
        <tem:referer>${payload.referer}</tem:referer>
      </tem:getCreateOrdersNew>
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

const getCheckOrderStatus = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:getCheckOrderStatus>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:value>${payload.value}</tem:value>
      </tem:getCheckOrderStatus>
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

const getPayments = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:getPayments>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:order_id>${payload.order_id}</tem:order_id>
        <tem:order_code>${payload.order_code}</tem:order_code>
        <tem:payment_methods_id>${payload.payment_methods_id}</tem:payment_methods_id>
        <tem:receive_no>${payload.receive_no}</tem:receive_no>
        <tem:amount>${payload.amount}</tem:amount>
        <tem:comments>${payload.comments}</tem:comments>
        <tem:same_install>${payload.same_install}</tem:same_install>
        <tem:house_no>${payload.house_no}</tem:house_no>
        <tem:moo>${payload.moo}</tem:moo>
        <tem:village>${payload.village}</tem:village>
        <tem:soi>${payload.soi}</tem:soi>
        <tem:road>${payload.road}</tem:road>
        <tem:sub_district>${payload.sub_district}</tem:sub_district>
        <tem:district_id>${payload.district_id}</tem:district_id>
        <tem:province_id>${payload.province_id}</tem:province_id>
        <tem:zip>${payload.zip}</tem:zip>
      </tem:getPayments>
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

const getScheduleAvailable = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:getScheduleAvailable>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:office_id>${payload.office_id}</tem:office_id>
      </tem:getScheduleAvailable>
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

const dateInstallEstimate = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:dateInstallEstimate>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:order_id>${payload.order_id}</tem:order_id>
        <tem:date_time>${payload.date_time}</tem:date_time>
      </tem:dateInstallEstimate>
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

const changeService = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:changeService>
      <tem:username>${process.env.FTTX_USERNAME}</tem:username>
      <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
      <tem:telno>${payload.telno}</tem:telno>
      <tem:product_code>${payload.product_code}</tem:product_code>
      <tem:offer_id>${payload.offer_id}</tem:offer_id>
      <tem:promotion_id>${payload.promotion_id}</tem:promotion_id>
      <tem:speed>${payload.speed}</tem:speed>
      <tem:service_name>${payload.service_name}</tem:service_name>
      <tem:date_change>${payload.date_change}</tem:date_change>
      <tem:change_by>${payload.change_by}</tem:change_by>
      <tem:note>${payload.note}</tem:note>
    </tem:changeService>
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

const cancleOrder = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:WebServiceControllerwsdl">
    <soapenv:Header/>
    <soapenv:Body>
      <urn:cancelOrder soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <username xsi:type="xsd:string">${process.env.FTTX_USERNAME}</username>
        <password xsi:type="xsd:string">${process.env.FTTX_PASSWORD}</password>
        <order_id xsi:type="xsd:int">${payload.order_id}</order_id>
      </urn:cancelOrder>
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

const insertLead = async (payload) => {
  const url = `${process.env.FTTX_URL}/index.php?r=WebService/sr&ws=1`;
  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
      <tem:insertLead>
        <tem:username>${process.env.FTTX_USERNAME}</tem:username>
        <tem:password>${process.env.FTTX_PASSWORD}</tem:password>
        <tem:first_name>${payload.first_name}</tem:first_name>
        <tem:last_name>${payload.last_name}</tem:last_name>
        <tem:mobile>${payload.mobile}</tem:mobile>
        <tem:date_install>${payload.date_install}</tem:date_install>
        <tem:latitude>${payload.latitude}</tem:latitude>
        <tem:longitude>${payload.longitude}</tem:longitude>
        <tem:address>${payload.address}</tem:address>
        <tem:no>${payload.no}</tem:no>
        <tem:village>${payload.village}</tem:village>
        <tem:building>${payload.building}</tem:building>
        <tem:moo>${payload.moo}</tem:moo>
        <tem:soi>${payload.soi}</tem:soi>
        <tem:road>${payload.road}</tem:road>
        <tem:province>${payload.province}</tem:province>
        <tem:district>${payload.district}</tem:district>
        <tem:subdistrict>${payload.subdistrict}</tem:subdistrict>
        <tem:zip_code>${payload.zip_code}</tem:zip_code>
        <tem:promotion_id>${payload.promotion_id}</tem:promotion_id>
        <tem:speed_id>${payload.speed_id}</tem:speed_id>
        <tem:note>${payload.note}</tem:note>
        <tem:device_id>${payload.device_id}</tem:device_id>
        <tem:exchange_id>${payload.exchange_id}</tem:exchange_id>
      </tem:insertLead>
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
  getSearchDpOnArea,
  getCreateOrdersNew,
  getCheckOrderStatus,
  getPayments,
  getScheduleAvailable,
  dateInstallEstimate,
  changeService,
  cancleOrder,
  insertLead,
};
