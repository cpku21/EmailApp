import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';
import { getEnv } from '@/lib/env';

const globalWithPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = getEnv();
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({ adapter });
}

export function getDb(): PrismaClient {
  // Create the client lazily, then reuse it across Next.js development reloads.
  globalWithPrisma.prisma ??= createPrismaClient();

  return globalWithPrisma.prisma;
}
