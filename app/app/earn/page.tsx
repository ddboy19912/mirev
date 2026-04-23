import { EarnActionPanel } from "@/components/dashboard/earn-action-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { StrategyInfoCard } from "@/components/dashboard/strategy-info-card";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { getCurrentSession } from "@/lib/auth";
import { getDatabaseStatus } from "@/lib/database-status";
import { getDefaultStrategyAdapter } from "@/lib/strategies/registry";
import { getTreasuryDashboard } from "@/lib/treasury/dashboard";

export const dynamic = "force-dynamic";

export default async function EarnPage() {
  const strategyAdapter = getDefaultStrategyAdapter();
  const [status, session, apyQuote, liquidityState] = await Promise.all([
    getDatabaseStatus(),
    getCurrentSession(),
    strategyAdapter.getApy(),
    strategyAdapter.getLiquidityState(),
  ]);
  const treasury = await getTreasuryDashboard(session?.userId ?? null);
  const strategy = strategyAdapter.config;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-8 py-10">
      <PageHeader
        eyebrow={`Earn · ${strategy.protocol}`}
        title="Route supported idle balances into yield"
        description="Mirev is built for asset management across buckets. Today, live earn routing supports USDC into Kamino and returns funds to Spend on demand."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="In Earn"
          value={treasury.earnBalance}
          suffix="USDC supported today"
          tone="emerald"
        />
        <StatCard
          label="Current APY"
          value={
            apyQuote.apyBps !== null
              ? `${(apyQuote.apyBps / 100).toFixed(2)}%`
              : "—"
          }
          suffix={apyQuote.source}
        />
        <StatCard
          label="Liquidity"
          value={liquidityState.redemptionWindow}
          suffix="Redemption"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <StrategyInfoCard
          connected={status.connected}
          apyQuote={apyQuote}
          liquidityState={liquidityState}
        />
        <EarnActionPanel initialSession={session} />
      </div>
    </div>
  );
}
