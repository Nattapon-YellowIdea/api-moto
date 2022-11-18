import sentry from '../config/sentry.js';

const captureException = (payload) => {
  sentry.addBreadcrumb({
    category: 'payload',
    message: JSON.stringify(payload),
    level: sentry.Severity.Info,
  });
};

export default captureException;
