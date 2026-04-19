import { getCurrentSession } from "@/lib/auth";
import { getWalletTokenBalances } from "@/lib/portfolio/helius";
import { prisma } from "@/lib/prisma";
import {
  AUTOPILOT_PROFILES,
  calculateAllocation,
  isAutopilotProfile,
} from "@/lib/treasury/profiles";

export const dynamic = "force-dynamic";

type AllocateDepositRequest = {
  walletAddress?: string;
  profile?: string;
};

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const body = (await request.json()) as AllocateDepositRequest;
  const walletAddress = body.walletAddress?.trim();
  const profile = body.profile?.trim().toLowerCase();

  if (!walletAddress || !profile) {
    return Response.json(
      { error: "walletAddress and profile are required." },
      { status: 400 },
    );
  }

  if (!isAutopilotProfile(profile)) {
    return Response.json(
      { error: "Profile must be safe, balanced, or growth." },
      { status: 400 },
    );
  }

  if (session.walletAddress !== walletAddress) {
    return Response.json(
      {
        error:
          "The connected wallet must match the signed Mirev session before allocation can continue.",
      },
      { status: 409 },
    );
  }

  const [walletBalance] = await getWalletTokenBalances({
    walletAddress,
    tokens: ["USDC"],
  });
  const totalAmount = Number(walletBalance?.balance ?? "0");

  if (totalAmount <= 0) {
    return Response.json(
      { error: "This wallet does not currently hold allocatable USDC." },
      { status: 400 },
    );
  }

  const allocation = calculateAllocation({
    totalAmount,
    profile,
  });
  const selectedProfile = AUTOPILOT_PROFILES[profile];

  const result = await prisma.$transaction(async (transaction) => {
    await transaction.bucketPolicy.updateMany({
      where: {
        userId: session.userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const bucketPolicy = await transaction.bucketPolicy.create({
      data: {
        userId: session.userId,
        spendPercent: selectedProfile.spendPercent,
        savePercent: selectedProfile.savePercent,
        earnPercent: selectedProfile.earnPercent,
        riskProfile: profile,
        isActive: true,
      },
    });

    await transaction.account.deleteMany({
      where: { userId: session.userId },
    });

    await transaction.account.createMany({
      data: [
        {
          userId: session.userId,
          bucketType: "Spend",
          token: "USDC",
          currentBalance: allocation.spendAmount,
        },
        {
          userId: session.userId,
          bucketType: "Save",
          token: "USDC",
          currentBalance: allocation.saveAmount,
        },
        {
          userId: session.userId,
          bucketType: "Earn",
          token: "USDC",
          currentBalance: allocation.earnAmount,
        },
      ],
    });

    await transaction.strategyAllocation.updateMany({
      where: {
        userId: session.userId,
        status: {
          in: ["pending_route", "routing_prepared", "active", "mock_active"],
        },
      },
      data: {
        status: "superseded",
      },
    });

    const strategyAllocation =
      Number(allocation.earnAmount) > 0
        ? await transaction.strategyAllocation.create({
            data: {
              userId: session.userId,
              strategyName: "kamino-usdc-supply",
              allocatedAmount: allocation.earnAmount,
              status: "pending_route",
            },
          })
        : null;

    await transaction.automationAction.createMany({
      data: [
        {
          userId: session.userId,
          actionType: "deposit_received",
          destinationBucket: "Wallet",
          amount: allocation.totalAmount,
          status: "completed",
        },
        {
          userId: session.userId,
          actionType: "funds_allocated_spend",
          destinationBucket: "Spend",
          amount: allocation.spendAmount,
          status: "completed",
        },
        {
          userId: session.userId,
          actionType: "funds_allocated_save",
          destinationBucket: "Save",
          amount: allocation.saveAmount,
          status: "completed",
        },
        {
          userId: session.userId,
          actionType: "funds_allocated_earn",
          destinationBucket: "Earn",
          amount: allocation.earnAmount,
          status: "completed",
        },
      ],
    });

    return {
      bucketPolicyId: bucketPolicy.id,
      strategyAllocationId: strategyAllocation?.id ?? null,
    };
  });

  return Response.json({
    walletBalance,
    profile,
    spendAmount: allocation.spendAmount,
    saveAmount: allocation.saveAmount,
    earnAmount: allocation.earnAmount,
    totalAmount: allocation.totalAmount,
    strategyAllocationId: result.strategyAllocationId,
  });
}
