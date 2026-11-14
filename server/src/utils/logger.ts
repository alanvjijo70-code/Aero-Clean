type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

const formatMessage = (level: LogLevel, message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const logger = {
  debug: (message: string, meta?: any) => {
    if (levels[currentLevel] <= levels.debug) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
  info: (message: string, meta?: any) => {
    if (levels[currentLevel] <= levels.info) {
      console.info(formatMessage('info', message, meta));
    }
  },
  warn: (message: string, meta?: any) => {
    if (levels[currentLevel] <= levels.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  error: (message: string, meta?: any) => {
    if (levels[currentLevel] <= levels.error) {
      console.error(formatMessage('error', message, meta));
    }
  }
};
