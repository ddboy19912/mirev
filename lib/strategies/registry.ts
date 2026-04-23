import {
  DEFAULT_STRATEGY_ID,
  getStrategyConfig,
  STRATEGY_CONFIGS,
} from "@/lib/strategies/config";
import { KaminoStrategyAdapter } from "@/lib/strategies/kamino-strategy-adapter";
import type {
  StrategyAdapter,
  StrategyConfig,
  StrategyId,
} from "@/lib/strategies/types";

const strategyAdapterCache = new Map<StrategyId, StrategyAdapter>();

function createStrategyAdapter(config: StrategyConfig): StrategyAdapter {
  switch (config.protocol) {
    case "Kamino Lend":
      return new KaminoStrategyAdapter(config);
    default:
      throw new Error(
        `No strategy adapter registered for protocol ${config.protocol}.`,
      );
  }
}

export function getStrategyAdapter(strategyId: StrategyId): StrategyAdapter {
  const cached = strategyAdapterCache.get(strategyId);

  if (cached) {
    return cached;
  }

  const config = getStrategyConfig(strategyId);
  const adapter = createStrategyAdapter(config);
  strategyAdapterCache.set(strategyId, adapter);
  return adapter;
}

export function getDefaultStrategyAdapter(): StrategyAdapter {
  return getStrategyAdapter(DEFAULT_STRATEGY_ID);
}

export function listStrategyConfigs(): StrategyConfig[] {
  return Object.values(STRATEGY_CONFIGS);
}
