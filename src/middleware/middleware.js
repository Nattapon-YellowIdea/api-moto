export function serviceAccessVerify(req, res, next) {
  const serviceAccessToken = req.headers['x-service-access'];
  req.body.service_access_token = serviceAccessToken;
  next();
}

export function getIP(req, res, next) {
  req.body['x-clientip'] = req.ip;
  next();
}
