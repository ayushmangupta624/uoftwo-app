// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Avoid instantiating multiple PrismaClient instances in development
// https://www.prisma.io/docs/support/help-center/help-articles/nextjs-best-practices
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
