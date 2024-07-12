const isProd = process.env.NODE_ENV === 'production';

const logger = {
  debug: (...args) => {
    if (!isProd) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  }
};

export default logger;