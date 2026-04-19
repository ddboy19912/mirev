import { KAMINO_USDC_SUPPLY_CONFIG } from "@/lib/strategies/config";

const KAMINO_API_BASE_URL = "https://api.kamino.finance";

type KaminoReserveMetrics = {
  reserve: string;
  liquidityToken: string;
  liquidityTokenMint: string;
  maxLtv: string;
  borrowApy: string;
  supplyApy: string;
  totalSupply: string;
  totalBorrow: string;
  totalBorrowUsd: string;
  totalSupplyUsd: string;
};

type KaminoPreparedTransactionResponse = {
  transaction: string;
};

async function fetchFromKamino<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${KAMINO_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Kamino API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function getKaminoReserveMetrics() {
  const metrics = await fetchFromKamino<KaminoReserveMetrics[]>(
    `/kamino-market/${KAMINO_USDC_SUPPLY_CONFIG.marketPubkey}/reserves/metrics?env=${KAMINO_USDC_SUPPLY_CONFIG.cluster}`,
  );

  const reserve =
    metrics.find(
      (entry) =>
        entry.liquidityTokenMint === KAMINO_USDC_SUPPLY_CONFIG.tokenMint ||
        entry.liquidityToken === KAMINO_USDC_SUPPLY_CONFIG.token,
    ) ?? null;

  return reserve;
}

async function buildKaminoTransaction(
  action: "deposit" | "withdraw",
  params: {
    walletAddress: string;
    marketPubkey: string;
    reservePubkey: string;
    amount: string;
  },
) {
  const payload = await fetchFromKamino<KaminoPreparedTransactionResponse>(
    `/ktx/klend/${action}`,
    {
      method: "POST",
      body: JSON.stringify({
        wallet: params.walletAddress,
        market: params.marketPubkey,
        reserve: params.reservePubkey,
        amount: params.amount,
      }),
    },
  );

  return payload.transaction;
}

export async function buildKaminoDepositTransaction(params: {
  walletAddress: string;
  marketPubkey: string;
  reservePubkey: string;
  amount: string;
}) {
  return buildKaminoTransaction("deposit", params);
}

export async function buildKaminoWithdrawTransaction(params: {
  walletAddress: string;
  marketPubkey: string;
  reservePubkey: string;
  amount: string;
}) {
  return buildKaminoTransaction("withdraw", params);
}
