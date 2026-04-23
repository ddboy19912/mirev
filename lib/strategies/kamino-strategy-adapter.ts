import {
  buildKaminoDepositTransaction,
  buildKaminoWithdrawTransaction,
  getKaminoReserveMetrics,
} from "@/lib/strategies/kamino-api";
import type {
  StrategyAdapter,
  StrategyApyQuote,
  StrategyConfig,
  StrategyLiquidityState,
  StrategyPreparedTransaction,
  StrategyPrepareParams,
} from "@/lib/strategies/types";

export class KaminoStrategyAdapter implements StrategyAdapter {
  constructor(readonly config: StrategyConfig) {}

  async getApy(): Promise<StrategyApyQuote> {
    try {
      const reserve = await getKaminoReserveMetrics(this.config);

      if (!reserve) {
        return {
          apyBps: null,
          source: "fallback",
          fetchedAt: new Date().toISOString(),
          note: "Kamino reserve data is not available yet, so live supply APY could not be resolved.",
        };
      }

      return {
        apyBps: Math.round(Number(reserve.supplyApy) * 10_000),
        source: "kamino-api",
        fetchedAt: new Date().toISOString(),
        note: `Live supply APY for ${reserve.liquidityToken} from Kamino reserve metrics.`,
      };
    } catch {
      return {
        apyBps: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        note: "Kamino API was unavailable during this request, so live APY could not be displayed.",
      };
    }
  }

  async prepareDeposit({
    walletAddress,
    amount,
  }: StrategyPrepareParams): Promise<StrategyPreparedTransaction> {
    const reserve = await getKaminoReserveMetrics(this.config);
    const reservePubkey = reserve?.reserve ?? this.config.fallbackReservePubkey;
    const serializedTransaction = await buildKaminoDepositTransaction({
      walletAddress,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      amount,
    });

    return {
      actionId: null,
      requiresUserSignature: true,
      serializedTransaction,
      encoding: "base64",
      status: "awaiting_user_signature",
      walletAddress,
      amount,
      token: this.config.assetSymbol,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      venueLabel: this.config.protocol,
      summary: `Prepared a Kamino deposit for ${amount} ${this.config.assetSymbol}. User signature is required before funds move into the Earn bucket strategy.`,
    };
  }

  async prepareWithdraw({
    walletAddress,
    amount,
  }: StrategyPrepareParams): Promise<StrategyPreparedTransaction> {
    const reserve = await getKaminoReserveMetrics(this.config);
    const reservePubkey = reserve?.reserve ?? this.config.fallbackReservePubkey;
    const serializedTransaction = await buildKaminoWithdrawTransaction({
      walletAddress,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      amount,
    });

    return {
      actionId: null,
      requiresUserSignature: true,
      serializedTransaction,
      encoding: "base64",
      status: "awaiting_user_signature",
      walletAddress,
      amount,
      token: this.config.assetSymbol,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      venueLabel: this.config.protocol,
      summary: `Prepared a Kamino withdrawal for ${amount} ${this.config.assetSymbol} back to Spend. User signature is required before funds move.`,
    };
  }

  async getLiquidityState(): Promise<StrategyLiquidityState> {
    try {
      const reserve = await getKaminoReserveMetrics(this.config);

      if (!reserve) {
        return {
          available: false,
          redemptionWindow: "same-block target, dependent on pool liquidity",
          reason:
            "Kamino reserve metrics were unavailable, so Mirev cannot currently verify live withdrawal headroom.",
        };
      }

      const totalSupply = Number(reserve.totalSupply);
      const totalBorrow = Number(reserve.totalBorrow);
      const availableLiquidity = Math.max(totalSupply - totalBorrow, 0);

      return {
        available: availableLiquidity > 0,
        redemptionWindow: "same-block target, dependent on pool liquidity",
        reason:
          availableLiquidity > 0
            ? `${availableLiquidity.toFixed(2)} ${reserve.liquidityToken} of visible reserve headroom remains before accounting for wallet-level constraints.`
            : "Visible reserve headroom is currently tight, so withdrawals may be constrained until more liquidity returns.",
      };
    } catch {
      return {
        available: false,
        redemptionWindow: "same-block target, dependent on pool liquidity",
        reason:
          "Kamino API was unavailable during this request, so Mirev cannot verify live withdrawal headroom right now.",
      };
    }
  }
}
