import type { StrategyConfig, StrategyId } from "@/lib/strategies/types";

export const KAMINO_USDC_SUPPLY_CONFIG: StrategyConfig = {
  id: "kamino-usdc-supply",
  protocol: "Kamino Lend",
  assetSymbol: "USDC",
  assetMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  bucket: "Earn",
  category: "lending",
  network: "Solana",
  cluster: "mainnet-beta",
  marketPubkey: "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF",
  fallbackReservePubkey: "D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59",
  liquidityProfile: "same-block redeem subject to pool liquidity",
  summary:
    "Idle USDC from the Earn bucket is supplied into Kamino Lend to earn lending yield while Spend stays liquid.",
  riskNote:
    "Lending market risk remains protocol-dependent, so Mirev treats this as the only approved MVP earn rail and keeps the spend buffer outside the strategy.",
};

export const DEFAULT_STRATEGY_ID: StrategyId = "kamino-usdc-supply";

export const STRATEGY_CONFIGS: Record<StrategyId, StrategyConfig> = {
  "kamino-usdc-supply": KAMINO_USDC_SUPPLY_CONFIG,
};

export function getStrategyConfig(strategyId: StrategyId) {
  return STRATEGY_CONFIGS[strategyId];
}
