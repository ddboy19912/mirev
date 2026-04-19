import { KAMINO_USDC_SUPPLY_CONFIG } from "@/lib/strategies/config";
import {
  buildKaminoDepositTransaction,
  buildKaminoWithdrawTransaction,
  getKaminoReserveMetrics,
} from "@/lib/strategies/kamino-api";
import type {
  StrategyAdapter,
  StrategyApyQuote,
  StrategyLiquidityState,
  StrategyPreparedTransaction,
  StrategyPrepareParams,
} from "@/lib/strategies/types";

export class KaminoStrategyAdapter implements StrategyAdapter {
  readonly config = KAMINO_USDC_SUPPLY_CONFIG;

  private createMockPreparedTransaction({
    action,
    walletAddress,
    amount,
  }: {
    action: "deposit" | "withdraw";
    walletAddress: string;
    amount: string;
  }): StrategyPreparedTransaction {
    return {
      actionId: null,
      executionMode: "mock",
      requiresUserSignature: false,
      serializedTransaction: null,
      encoding: null,
      status: "mock_ready",
      walletAddress,
      amount,
      token: this.config.token,
      marketPubkey: this.config.marketPubkey,
      reservePubkey: this.config.fallbackReservePubkey,
      venueLabel: this.config.protocol,
      summary:
        action === "deposit"
          ? `Prepared a mock Kamino deposit for ${amount} ${this.config.token}. No funds will move in mock mode.`
          : `Prepared a mock Kamino withdrawal for ${amount} ${this.config.token} back to Spend. No funds will move in mock mode.`,
    };
  }

  async getApy(): Promise<StrategyApyQuote> {
    try {
      const reserve = await getKaminoReserveMetrics();

      if (!reserve) {
        return {
          apyBps: null,
          source: "mock",
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
        source: "mock",
        fetchedAt: new Date().toISOString(),
        note: "Kamino API was unavailable during this request, so live APY could not be displayed.",
      };
    }
  }

  async prepareDeposit({
    walletAddress,
    amount,
    executionMode,
  }: StrategyPrepareParams): Promise<StrategyPreparedTransaction> {
    if (executionMode === "mock") {
      return this.createMockPreparedTransaction({
        action: "deposit",
        walletAddress,
        amount,
      });
    }

    const reserve = await getKaminoReserveMetrics();
    const reservePubkey = reserve?.reserve ?? this.config.fallbackReservePubkey;
    const serializedTransaction = await buildKaminoDepositTransaction({
      walletAddress,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      amount,
    });

    return {
      actionId: null,
      executionMode: "live",
      requiresUserSignature: true,
      serializedTransaction,
      encoding: "base64",
      status: "awaiting_user_signature",
      walletAddress,
      amount,
      token: this.config.token,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      venueLabel: this.config.protocol,
      summary: `Prepared a Kamino deposit for ${amount} ${this.config.token}. User signature is required before funds move into the Earn bucket strategy.`,
    };
  }

  async prepareWithdraw({
    walletAddress,
    amount,
    executionMode,
  }: StrategyPrepareParams): Promise<StrategyPreparedTransaction> {
    if (executionMode === "mock") {
      return this.createMockPreparedTransaction({
        action: "withdraw",
        walletAddress,
        amount,
      });
    }

    const reserve = await getKaminoReserveMetrics();
    const reservePubkey = reserve?.reserve ?? this.config.fallbackReservePubkey;
    const serializedTransaction = await buildKaminoWithdrawTransaction({
      walletAddress,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      amount,
    });

    return {
      actionId: null,
      executionMode: "live",
      requiresUserSignature: true,
      serializedTransaction,
      encoding: "base64",
      status: "awaiting_user_signature",
      walletAddress,
      amount,
      token: this.config.token,
      marketPubkey: this.config.marketPubkey,
      reservePubkey,
      venueLabel: this.config.protocol,
      summary: `Prepared a Kamino withdrawal for ${amount} ${this.config.token} back to Spend. User signature is required before funds move.`,
    };
  }

  async getLiquidityState(): Promise<StrategyLiquidityState> {
    try {
      const reserve = await getKaminoReserveMetrics();

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

export const kaminoStrategyAdapter = new KaminoStrategyAdapter();
