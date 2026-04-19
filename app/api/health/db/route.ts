import { getDatabaseStatus } from "@/lib/database-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getDatabaseStatus();

  return Response.json(status, {
    status: status.connected ? 200 : 503,
  });
}
