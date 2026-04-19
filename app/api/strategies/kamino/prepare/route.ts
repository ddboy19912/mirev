import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveExecutionMode } from "@/lib/strategies/execution-mode";
import { kaminoStrategyAdapter } from "@/lib/strategies/kamino-strategy-adapter";

export const dynamic = "force-dynamic";

type PrepareRequest = {
  action?: "deposit" | "withdraw";
  amount?: string;
  executionMode?: string;
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
  const executionMode = resolveExecutionMode(body.executionMode);

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
      actionType:
        action === "deposit"
          ? executionMode === "mock"
            ? "kamino_mock_deposit"
            : "kamino_deposit"
          : executionMode === "mock"
            ? "kamino_mock_withdraw"
            : "kamino_withdraw",
      sourceBucket: action === "deposit" ? "Save" : "Earn",
      destinationBucket: action === "deposit" ? "Earn" : "Spend",
      amount,
      status:
        executionMode === "mock" ? "mock_prepared" : "awaiting_user_signature",
    },
  });

  try {
    const preparedTransaction =
      action === "deposit"
        ? await kaminoStrategyAdapter.prepareDeposit({
            walletAddress: session.walletAddress,
            amount,
            executionMode,
          })
        : await kaminoStrategyAdapter.prepareWithdraw({
            walletAddress: session.walletAddress,
            amount,
            executionMode,
          });

    return Response.json({
      ...preparedTransaction,
      actionId: actionRecord.id,
    });
  } catch (error) {
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
