import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 AeroClean AI API Server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
  logger.info(`📡 API endpoint: http://localhost:${env.PORT}/api/v1`);
  logger.info(`🛡️ Health check: http://localhost:${env.PORT}/api/v1/health`);
});

const handleTermination = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully terminating AeroClean AI server...`);
  server.close(() => {
    logger.info('Server process terminated safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleTermination('SIGTERM'));
process.on('SIGINT', () => handleTermination('SIGINT'));

export default app;
export { app, server };
