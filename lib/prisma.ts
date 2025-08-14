import { PrismaClient } from "@prisma/client";

// Create a single global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use a single Prisma client instance to avoid connection conflicts
// Configure for Supabase with connection pool disabled to fix prepared statement issues
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=1&pool_timeout=0&pgbouncer=true&connect_timeout=10",
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// For compatibility with existing code, export the same instance
export default prisma;

// Keep the createPrismaClient function for backward compatibility
export function createPrismaClient() {
  return prisma;
}

// Add connection cleanup to handle prepared statement issues
export async function cleanupPrismaConnections() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting Prisma client:', error);
  }
}

// Handle process termination to clean up connections
process.on('beforeExit', async () => {
  await cleanupPrismaConnections();
});

process.on('SIGINT', async () => {
  await cleanupPrismaConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanupPrismaConnections();
  process.exit(0);
});