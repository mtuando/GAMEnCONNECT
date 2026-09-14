import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const isNeon = connectionString.includes('neon.tech');

const adapter = isNeon
  ? new PrismaNeon({ connectionString })
  : new PrismaPg({ connectionString });

export const prisma = new PrismaClient({
  adapter,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;