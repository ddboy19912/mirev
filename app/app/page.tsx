import { AutomationFeedCard } from "@/components/dashboard/automation-feed-card";
import { BucketBalancesCard } from "@/components/dashboard/bucket-balances-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { StrategyInfoCard } from "@/components/dashboard/strategy-info-card";
import { getCurrentSession } from "@/lib/auth";
import { getDatabaseStatus } from "@/lib/database-status";
import { getRecentStrategyExecutionLogs } from "@/lib/strategies/feed";
import { getDefaultStrategyAdapter } from "@/lib/strategies/registry";
import { getTreasuryDashboard } from "@/lib/treasury/dashboard";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const strategyAdapter = getDefaultStrategyAdapter();
  const [status, session, apyQuote, liquidityState] = await Promise.all([
    getDatabaseStatus(),
    getCurrentSession(),
    strategyAdapter.getApy(),
    strategyAdapter.getLiquidityState(),
  ]);
  const treasury = await getTreasuryDashboard(session?.userId ?? null);
  const recentExecutions = await getRecentStrategyExecutionLogs(
    session?.userId ?? null,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-8 py-10">
      <PageHeader
        eyebrow="Treasury Overview"
        title={
          session
            ? "Your autopilot dashboard"
            : "Connect a wallet to see your autopilot dashboard"
        }
        description="Mirev manages assets across Spend, Save, and Earn. Live routing currently supports idle USDC into Kamino while Spend stays liquid."
      />

      <StatGrid
        totalBalance={treasury.totalBalance}
        availableNowBalance={treasury.availableNowBalance}
        earnBalance={treasury.earnBalance}
        activeProfile={treasury.activeProfile}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StrategyInfoCard
          connected={status.connected}
          apyQuote={apyQuote}
          liquidityState={liquidityState}
        />
        <BucketBalancesCard
          spendBalance={treasury.spendBalance}
          saveBalance={treasury.saveBalance}
          earnBalance={treasury.earnBalance}
        />
      </div>

      <AutomationFeedCard executions={recentExecutions} />
    </div>
  );
}
