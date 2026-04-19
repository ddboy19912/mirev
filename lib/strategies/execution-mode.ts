import type { StrategyExecutionMode } from "@/lib/strategies/types";

const DEFAULT_EXECUTION_MODE: StrategyExecutionMode = "mock";

export function getDefaultExecutionMode(): StrategyExecutionMode {
  const value = process.env.NEXT_PUBLIC_STRATEGY_EXECUTION_MODE;

  if (value === "live" || value === "mock") {
    return value;
  }

  return DEFAULT_EXECUTION_MODE;
}

export function resolveExecutionMode(
  candidate: string | null | undefined,
): StrategyExecutionMode {
  if (candidate === "live" || candidate === "mock") {
    return candidate;
  }

  return getDefaultExecutionMode();
}
