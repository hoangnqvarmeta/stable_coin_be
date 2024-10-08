import { Params } from 'nestjs-pino';
import { LoggerOptions } from 'pino';

export const loggerOptions: LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
      singleLine: true,
      messageFormat: '{req.method} {req.url} {res.statusCode}', // Log basic request details
    },
  },
  customLevels: {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
    http: 35, // Custom level for HTTP requests
  },
  useOnlyCustomLevels: true,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body, // Log request body when applicable
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err(err) {
      return {
        type: err.type,
        message: err.message,
        stack: err.stack, // Log error stack for debugging
      };
    },
  },
};

export const LoggerConfiguration = (): Params => {
  const logLevel = process.env.LOG_LEVEL || 'info';

  const allowedLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

  if (!allowedLevels.includes(logLevel)) {
    throw new Error(
      `${logLevel} is not a valid log level. Check your LOG_LEVEL env variable.`,
    );
  }

  return {
    pinoHttp: {
      ...loggerOptions,
      level: logLevel,
    },
  };
};
