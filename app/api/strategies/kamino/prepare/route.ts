import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStrategyAdapter } from "@/lib/strategies/registry";

export const dynamic = "force-dynamic";

type PrepareRequest = {
  action?: "deposit" | "withdraw";
  amount?: string;
  strategyAllocationId?: string;
};

function isValidAmount(amount: string) {
  const parsed = Number(amount);
  return Number.isFinite(parsed) && parsed > 0;
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as PrepareRequest;
  const action = body.action;
  const amount = body.amount?.trim();
  const strategyAllocationId = body.strategyAllocationId?.trim();

  if (!action || !amount) {
    return Response.json(
      { error: "action and amount are required." },
      { status: 400 },
    );
  }

  if (!isValidAmount(amount)) {
    return Response.json(
      { error: "Amount must be a positive decimal value." },
      { status: 400 },
    );
  }

  const actionRecord = await prisma.automationAction.create({
    data: {
      userId: session.userId,
      actionType: action === "deposit" ? "kamino_deposit" : "kamino_withdraw",
      sourceBucket: action === "deposit" ? "Save" : "Earn",
      destinationBucket: action === "deposit" ? "Earn" : "Spend",
      amount,
      status: "awaiting_user_signature",
    },
  });

  try {
    const strategyAdapter = getStrategyAdapter("kamino-usdc-supply");

    if (strategyAllocationId) {
      const strategyAllocation = await prisma.strategyAllocation.findFirst({
        where: {
          id: strategyAllocationId,
          userId: session.userId,
        },
      });

      if (!strategyAllocation) {
        throw new Error("Strategy allocation not found for this session.");
      }

      await prisma.strategyAllocation.update({
        where: { id: strategyAllocation.id },
        data: {
          status: "routing_prepared",
        },
      });
    }

    const preparedTransaction =
      action === "deposit"
        ? await strategyAdapter.prepareDeposit({
            walletAddress: session.walletAddress,
            amount,
          })
        : await strategyAdapter.prepareWithdraw({
            walletAddress: session.walletAddress,
            amount,
          });

    return Response.json({
      ...preparedTransaction,
      actionId: actionRecord.id,
    });
  } catch (error) {
    if (strategyAllocationId) {
      await prisma.strategyAllocation.updateMany({
        where: {
          id: strategyAllocationId,
          userId: session.userId,
        },
        data: {
          status: "route_failed",
        },
      });
    }

    await prisma.automationAction.update({
      where: { id: actionRecord.id },
      data: {
        status: "prepare_failed",
      },
    });

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not prepare a Kamino transaction.",
      },
      { status: 502 },
    );
  }
}
