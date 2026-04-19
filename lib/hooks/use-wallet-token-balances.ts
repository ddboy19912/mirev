"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  serializeTokenDescriptors,
  type TokenDescriptorInput,
} from "@/lib/portfolio/tokens";
import type { WalletTokenBalance } from "@/lib/portfolio/helius";

type WalletBalancesResponse = {
  walletAddress: string;
  balances: WalletTokenBalance[];
};

async function fetchWalletTokenBalances({
  walletAddress,
  tokens,
}: {
  walletAddress: string;
  tokens: TokenDescriptorInput[];
}) {
  const searchParams = new URLSearchParams({
    walletAddress,
    tokens: serializeTokenDescriptors(tokens),
  });

  const response = await fetch(
    `/api/wallet/balances?${searchParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };

    throw new Error(
      payload.error ?? "Could not fetch wallet balances from Mirev.",
    );
  }

  return (await response.json()) as WalletBalancesResponse;
}

export function useWalletTokenBalances({
  tokens,
  enabled = true,
  refetchInterval = false,
}: {
  tokens: TokenDescriptorInput[];
  enabled?: boolean;
  refetchInterval?: number | false;
}) {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;
  const serializedTokens = serializeTokenDescriptors(tokens);

  return useQuery({
    queryKey: [
      "wallet-token-balances",
      walletAddress ?? "disconnected",
      serializedTokens,
    ],
    enabled: Boolean(walletAddress) && enabled,
    queryFn: async () =>
      fetchWalletTokenBalances({
        walletAddress: walletAddress!,
        tokens,
      }),
    refetchInterval,
  });
}
