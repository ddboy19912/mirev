import {
  formatApyCopy,
  formatLiquidityCopy,
  formatStrategyRouteCopy,
} from "@/lib/strategies/feed";
import type {
  StrategyApyQuote,
  StrategyLiquidityState,
} from "@/lib/strategies/types";
import { getDefaultStrategyAdapter } from "@/lib/strategies/registry";

type StrategyInfoCardProps = {
  connected: boolean;
  apyQuote: StrategyApyQuote;
  liquidityState: StrategyLiquidityState;
};

export function StrategyInfoCard({
  connected,
  apyQuote,
  liquidityState,
}: StrategyInfoCardProps) {
  const strategy = getDefaultStrategyAdapter().config;

  return (
    <article className="rounded-3xl bg-[#0d1117] p-8 text-white">
      <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
        Strategy · {connected ? "Live" : "Needs Attention"}
      </p>
      <h2 className="mt-4 text-2xl leading-snug font-bold tracking-[-0.02em]">
        {connected
          ? "Database and strategy scaffolding are ready."
          : "Strategy scaffolding ready — connectivity needs attention."}
      </h2>
      <p className="mt-3 text-sm leading-7 text-gray-400">
        {formatStrategyRouteCopy(strategy.summary)}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/6 bg-white/4 p-4">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Liquidity
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            {formatLiquidityCopy(liquidityState)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/6 bg-white/4 p-4">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            APY Source
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            {formatApyCopy(apyQuote)}
          </p>
        </div>
      </div>
      <p className="mt-6 text-xs leading-6 text-gray-500">
        {strategy.riskNote}
      </p>
    </article>
  );
}
