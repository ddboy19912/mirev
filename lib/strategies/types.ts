export type StrategyId = "kamino-usdc-supply";

export type StrategyCategory = "lending";

export type StrategyConfig = {
  id: StrategyId;
  protocol: "Kamino Lend";
  assetSymbol: string;
  assetMint: string;
  bucket: "Earn";
  category: StrategyCategory;
  network: "Solana";
  cluster: "mainnet-beta";
  marketPubkey: string;
  fallbackReservePubkey: string;
  liquidityProfile: "same-block redeem subject to pool liquidity";
  summary: string;
  riskNote: string;
};

export type StrategyLiquidityState = {
  available: boolean;
  redemptionWindow: string;
  reason: string;
};

export type StrategyApyQuote = {
  apyBps: number | null;
  source: "kamino-api" | "fallback";
  fetchedAt: string;
  note: string;
};

export type StrategyPreparedTransaction = {
  actionId: string | null;
  requiresUserSignature: boolean;
  serializedTransaction: string | null;
  encoding: "base64" | null;
  status: "awaiting_user_signature";
  walletAddress: string;
  amount: string;
  token: string;
  marketPubkey: string;
  reservePubkey: string;
  venueLabel: string;
  summary: string;
};

export type StrategyExecutionLog = {
  id: string;
  actionType: string;
  status: string;
  amount: string;
  sourceBucket: string | null;
  destinationBucket: string | null;
  txSignature: string | null;
  createdAt: string;
};

export type StrategyPrepareParams = {
  walletAddress: string;
  amount: string;
};

export interface StrategyAdapter {
  readonly config: StrategyConfig;
  getApy(): Promise<StrategyApyQuote>;
  getLiquidityState(): Promise<StrategyLiquidityState>;
  prepareDeposit(
    params: StrategyPrepareParams,
  ): Promise<StrategyPreparedTransaction>;
  prepareWithdraw(
    params: StrategyPrepareParams,
  ): Promise<StrategyPreparedTransaction>;
}
