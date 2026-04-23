"use client";

import { PhantomWalletProvider } from "@/components/providers/phantom-wallet-provider";
import { QueryProvider } from "@/components/providers/query-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <PhantomWalletProvider>{children}</PhantomWalletProvider>
    </QueryProvider>
  );
}
