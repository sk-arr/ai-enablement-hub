import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getConnectionString() {
  const connectionString =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error("Missing database connection string");
  }

  return connectionString;
}

function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: getConnectionString(),
  });
  return new PrismaClient({ adapter });
}

export function getPrismaClient() {
  const client = globalForPrisma.prisma ?? createPrismaClient();

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

  return client;
}
