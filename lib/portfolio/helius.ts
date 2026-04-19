import {
  resolveTokenDescriptors,
  type TokenDescriptorInput,
} from "@/lib/portfolio/tokens";

type HeliusBalance = {
  mint: string;
  balance: number;
  decimals: number;
  tokenProgram: string;
  symbol?: string | null;
  name?: string | null;
  pricePerToken?: number | null;
  usdValue?: number | null;
  logoUri?: string | null;
};

type HeliusBalancesResponse = {
  balances: HeliusBalance[];
  totalUsdValue: number;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

export type WalletTokenBalance = {
  symbol: string;
  mint: string;
  name: string;
  decimals: number;
  balance: string;
  rawAmount: string;
  usdValue: number | null;
  pricePerToken: number | null;
  logoUri: string | null;
  tokenProgram: string | null;
  refreshedAt: string;
};

function getHeliusApiKey() {
  const apiKey = process.env.HELIUS_API_KEY;

  if (!apiKey) {
    throw new Error("HELIUS_API_KEY is required for wallet balance fetching.");
  }

  return apiKey;
}

async function fetchHeliusWalletBalances(walletAddress: string) {
  const response = await fetch(
    `https://api.helius.xyz/v1/wallet/${walletAddress}/balances`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": getHeliusApiKey(),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Helius wallet balance request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as HeliusBalancesResponse;
}

export async function getWalletTokenBalances({
  walletAddress,
  tokens,
}: {
  walletAddress: string;
  tokens: TokenDescriptorInput[];
}) {
  const [heliusBalances, resolvedTokens] = await Promise.all([
    fetchHeliusWalletBalances(walletAddress),
    Promise.resolve(resolveTokenDescriptors(tokens)),
  ]);

  const refreshedAt = new Date().toISOString();

  return resolvedTokens.map((token) => {
    const heliusBalance =
      heliusBalances.balances.find(
        (balance) =>
          balance.mint === token.mint ||
          (balance.symbol?.toUpperCase() ?? "") === token.symbol.toUpperCase(),
      ) ?? null;

    const balanceValue = heliusBalance?.balance ?? 0;
    const decimals = heliusBalance?.decimals ?? token.decimals;
    const rawAmount = Math.round(balanceValue * 10 ** decimals).toString();

    return {
      symbol: heliusBalance?.symbol ?? token.symbol,
      mint: heliusBalance?.mint ?? token.mint,
      name: heliusBalance?.name ?? token.name,
      decimals,
      balance: balanceValue.toFixed(decimals),
      rawAmount,
      usdValue: heliusBalance?.usdValue ?? null,
      pricePerToken: heliusBalance?.pricePerToken ?? null,
      logoUri: heliusBalance?.logoUri ?? null,
      tokenProgram: heliusBalance?.tokenProgram ?? null,
      refreshedAt,
    } satisfies WalletTokenBalance;
  });
}
