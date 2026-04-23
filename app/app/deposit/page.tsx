import { PageHeader } from "@/components/dashboard/page-header";
import { BucketBalancesCard } from "@/components/dashboard/bucket-balances-card";
import { AssetAllocationCard } from "@/components/deposits/asset-allocation-card";
import { getCurrentSession } from "@/lib/auth";
import { getTreasuryDashboard } from "@/lib/treasury/dashboard";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
  const session = await getCurrentSession();
  const treasury = await getTreasuryDashboard(session?.userId ?? null);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-8 py-10">
      <PageHeader
        eyebrow="Deposit"
        title="Read and allocate supported assets"
        description="Mirev manages assets across Spend, Save, and Earn. Today, live allocation supports USDC on Solana while the product expands toward broader asset support."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AssetAllocationCard initialSession={session} />
        <BucketBalancesCard
          spendBalance={treasury.spendBalance}
          saveBalance={treasury.saveBalance}
          earnBalance={treasury.earnBalance}
        />
      </div>
    </div>
  );
}
