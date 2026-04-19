import { prisma } from "@/lib/prisma";

export async function getTreasuryDashboard(userId: string | null) {
  if (!userId) {
    return {
      totalBalance: "0.000000",
      availableNowBalance: "0.000000",
      spendBalance: "0.000000",
      saveBalance: "0.000000",
      earnBalance: "0.000000",
      activeProfile: null as string | null,
    };
  }

  const [accounts, activePolicy] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.bucketPolicy.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const spendBalance =
    accounts.find((account) => account.bucketType === "Spend")
      ?.currentBalance ?? 0;
  const saveBalance =
    accounts.find((account) => account.bucketType === "Save")?.currentBalance ??
    0;
  const earnBalance =
    accounts.find((account) => account.bucketType === "Earn")?.currentBalance ??
    0;
  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.currentBalance),
    0,
  );

  return {
    totalBalance: totalBalance.toFixed(6),
    availableNowBalance: Number(spendBalance).toFixed(6),
    spendBalance: Number(spendBalance).toFixed(6),
    saveBalance: Number(saveBalance).toFixed(6),
    earnBalance: Number(earnBalance).toFixed(6),
    activeProfile: activePolicy?.riskProfile ?? null,
  };
}
