import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL nao esta definido. Coloque no .env.local (ou .env) e reinicie o npm run dev."
  );
}

// Mostra so o host (sem senha) para conferir no terminal
console.log("[prisma] conectando em:", connectionString.split("@")[1]?.split("/")[0]);

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;