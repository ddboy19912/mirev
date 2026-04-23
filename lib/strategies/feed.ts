import { prisma } from "@/lib/prisma";
import type {
  StrategyApyQuote,
  StrategyExecutionLog,
  StrategyLiquidityState,
} from "@/lib/strategies/types";

export function formatStrategyRouteCopy(summary: string) {
  return `Earn funds are routed to Kamino Lend. ${summary}`;
}

export function formatLiquidityCopy(liquidityState: StrategyLiquidityState) {
  return `${liquidityState.redemptionWindow} - ${liquidityState.reason}`;
}

export function formatApyCopy(apy: StrategyApyQuote) {
  if (apy.apyBps === null) {
    return apy.note;
  }

  return `${(apy.apyBps / 100).toFixed(2)}% APY from ${apy.source}.`;
}

export function formatExecutionCopy(execution: StrategyExecutionLog) {
  const amount = `${execution.amount} USDC`;

  if (execution.actionType === "deposit_received") {
    return `Detected ${amount} in the connected wallet and recorded it as the current depositable USDC balance.`;
  }

  if (execution.actionType === "funds_allocated_spend") {
    return `Allocated ${amount} to Spend so it remains available-now in the wallet.`;
  }

  if (execution.actionType === "funds_allocated_save") {
    return `Allocated ${amount} to Save and kept it reserved in the wallet for later use.`;
  }

  if (execution.actionType === "funds_allocated_earn") {
    return `Allocated ${amount} to Earn so Mirev can route it into Kamino.`;
  }

  if (execution.actionType === "kamino_deposit") {
    if (execution.status === "submitted_by_user" && execution.txSignature) {
      return `User authorized a Kamino deposit of ${amount} from Save to Earn. Signature: ${execution.txSignature}.`;
    }

    return `Prepared a Kamino deposit of ${amount} from Save to Earn. Waiting for the user's wallet signature.`;
  }

  if (execution.actionType === "kamino_withdraw") {
    if (execution.status === "submitted_by_user" && execution.txSignature) {
      return `User authorized a Kamino withdrawal of ${amount} from Earn back to Spend. Signature: ${execution.txSignature}.`;
    }

    return `Prepared a Kamino withdrawal of ${amount} from Earn back to Spend. Waiting for the user's wallet signature.`;
  }

  return `Recorded ${execution.actionType} for ${amount}.`;
}

export function formatExecutionTimestamp(createdAt: string) {
  return new Date(createdAt).toLocaleString();
}

export async function getRecentStrategyExecutionLogs(userId: string | null) {
  if (!userId) {
    return [] satisfies StrategyExecutionLog[];
  }

  const actions = await prisma.automationAction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return actions.map((action) => ({
    id: action.id,
    actionType: action.actionType,
    status: action.status,
    amount: action.amount.toString(),
    sourceBucket: action.sourceBucket,
    destinationBucket: action.destinationBucket,
    txSignature: action.txSignature,
    createdAt: action.createdAt.toISOString(),
  }));
}
