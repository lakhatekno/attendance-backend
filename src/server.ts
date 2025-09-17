import app from './app';
import { prisma } from './libs/prismaClient';

const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    console.log('Prisma connected to DB');
  } catch (err) {
    console.error('DB connection failed', err);
    process.exit(1);
  }
});

const shutdown = async (signal?: string) => {
  console.log(`Received ${signal ?? 'shutdown'}, closing server...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected');
    } catch (err) {
      console.error('Error during prisma disconnect', err);
    } finally {
      process.exit(0);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
