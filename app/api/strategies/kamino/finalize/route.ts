import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type FinalizeRequest = {
  actionId?: string;
  txSignature?: string;
  strategyAllocationId?: string;
};

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as FinalizeRequest;
  const actionId = body.actionId?.trim();
  const txSignature = body.txSignature?.trim();
  const strategyAllocationId = body.strategyAllocationId?.trim();

  if (!actionId || !txSignature) {
    return Response.json(
      { error: "actionId and txSignature are required." },
      { status: 400 },
    );
  }

  const action = await prisma.automationAction.findFirst({
    where: {
      id: actionId,
      userId: session.userId,
    },
  });

  if (!action) {
    return Response.json({ error: "Action not found." }, { status: 404 });
  }

  const updatedAction = await prisma.automationAction.update({
    where: { id: action.id },
    data: {
      txSignature,
      status: "submitted_by_user",
    },
  });

  if (strategyAllocationId) {
    await prisma.strategyAllocation.updateMany({
      where: {
        id: strategyAllocationId,
        userId: session.userId,
      },
      data: {
        status: "active",
      },
    });
  }

  return Response.json({
    id: updatedAction.id,
    status: updatedAction.status,
    txSignature: updatedAction.txSignature,
  });
}
