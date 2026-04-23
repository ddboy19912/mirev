import { StatCard } from "./ui/stat-card";

type StatGridProps = {
  totalBalance: string;
  availableNowBalance: string;
  earnBalance: string;
  activeProfile: string | null;
};

export function StatGrid({
  totalBalance,
  availableNowBalance,
  earnBalance,
  activeProfile,
}: StatGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Managed Balance"
        value={totalBalance}
        suffix="USDC supported today"
      />
      <StatCard
        label="Available Now"
        value={availableNowBalance}
        suffix="Spend Liquidity"
        tone="blue"
      />
      <StatCard
        label="In Earn"
        value={earnBalance}
        suffix="USDC routed to Kamino"
        tone="emerald"
      />
      <StatCard
        label="Active Profile"
        value={activeProfile ?? "—"}
        suffix="Autopilot Preset"
        tone="violet"
      />
    </section>
  );
}
