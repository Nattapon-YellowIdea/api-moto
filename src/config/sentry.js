import * as Sentry from '@sentry/node';
import '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  environment: process.env.SENTRY_ENVIRONMENT,
  debug: process.env.SENTRY_DEBUG,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 1.0,
});

export default Sentry;
