"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { SolanaWalletProvider } from "@/components/providers/solana-wallet-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </QueryProvider>
  );
}
