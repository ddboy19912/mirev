"use client";

import { AddressType } from "@phantom/browser-sdk";
import { PhantomProvider } from "@phantom/react-sdk";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PhantomWalletProvider({ children }: Props) {
  return (
    <PhantomProvider
      config={{
        providers: ["injected", "deeplink"],
        addressTypes: [AddressType.solana],
        ...(process.env.NEXT_PUBLIC_PHANTOM_APP_ID
          ? { appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID }
          : {}),
      }}
      appName="Mirev"
    >
      {children}
    </PhantomProvider>
  );
}
