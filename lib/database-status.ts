import { prisma } from "@/lib/prisma";

type DatabaseTarget = "neon" | "docker" | "unknown";

export type DatabaseStatus = {
  provider: "Postgres";
  orm: "Prisma";
  configured: boolean;
  connected: boolean;
  target: DatabaseTarget;
  databaseUrlLabel: string | null;
  checkedAt: string;
  message: string;
};

function getDatabaseTarget(url: string): DatabaseTarget {
  if (url.includes("neon.tech")) {
    return "neon";
  }

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return "docker";
  }

  return "unknown";
}

function getDatabaseUrlLabel(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return "DATABASE_URL is set";
  }
}

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return {
      provider: "Postgres",
      orm: "Prisma",
      configured: false,
      connected: false,
      target: "unknown",
      databaseUrlLabel: null,
      checkedAt: new Date().toISOString(),
      message:
        "DATABASE_URL is missing. Add your Neon connection string or use the local Docker Postgres URL.",
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      provider: "Postgres",
      orm: "Prisma",
      configured: true,
      connected: true,
      target: getDatabaseTarget(databaseUrl),
      databaseUrlLabel: getDatabaseUrlLabel(databaseUrl),
      checkedAt: new Date().toISOString(),
      message: "Database connection is healthy.",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to connect to the configured Postgres database.";

    return {
      provider: "Postgres",
      orm: "Prisma",
      configured: true,
      connected: false,
      target: getDatabaseTarget(databaseUrl),
      databaseUrlLabel: getDatabaseUrlLabel(databaseUrl),
      checkedAt: new Date().toISOString(),
      message,
    };
  }
}
