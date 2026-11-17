import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: _format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new _transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new _transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;