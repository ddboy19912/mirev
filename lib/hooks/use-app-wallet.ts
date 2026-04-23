"use client";

import { useMemo } from "react";
import {
  AddressType,
  useAccounts,
  useConnect,
  useDisconnect,
  useIsExtensionInstalled,
  usePhantom,
  useSolana,
} from "@phantom/react-sdk";
import {
  clusterApiUrl,
  Connection,
  type Transaction,
  type VersionedTransaction,
} from "@solana/web3.js";

export type WalletProviderType =
  | "phantom-extension"
  | "phantom-mobile"
  | "unknown";

export type WalletConnectionState = {
  isConnected: boolean;
  address: string | null;
  providerType: WalletProviderType;
};

export type AppWalletClient = WalletConnectionState & {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string | Uint8Array) => Promise<Uint8Array>;
  signAndSendTransaction: (
    transaction: Transaction | VersionedTransaction,
  ) => Promise<string>;
  getAddress: () => string | null;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isLoading: boolean;
  isCheckingExtension: boolean;
  isExtensionInstalled: boolean;
};

function getProviderType({
  isConnected,
  providerKind,
}: {
  isConnected: boolean;
  providerKind: string | undefined;
}): WalletProviderType {
  if (!isConnected) {
    return "unknown";
  }

  if (providerKind === "injected") {
    return "phantom-extension";
  }

  if (providerKind === "embedded") {
    return "phantom-mobile";
  }

  return "unknown";
}

export function getSolanaRpcEndpoint() {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl("mainnet-beta")
  );
}

export function useSolanaConnection() {
  return useMemo(() => new Connection(getSolanaRpcEndpoint()), []);
}

export function isWalletRejectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("reject") ||
    message.includes("denied") ||
    message.includes("cancel")
  );
}

export function useAppWallet(): AppWalletClient {
  const { sdk, isConnected, isLoading } = usePhantom();
  const { connect, isConnecting } = useConnect();
  const { disconnect, isDisconnecting } = useDisconnect();
  const { isInstalled, isLoading: isCheckingExtension } =
    useIsExtensionInstalled();
  const accounts = useAccounts();
  const { solana, isAvailable } = useSolana();

  const address =
    accounts?.find((account) => account.addressType === AddressType.solana)
      ?.address ??
    solana.publicKey ??
    null;
  const providerType = getProviderType({
    isConnected,
    providerKind: sdk?.getCurrentProviderInfo()?.type,
  });

  return {
    isConnected,
    address,
    providerType,
    isConnecting,
    isDisconnecting,
    isLoading: isLoading || isCheckingExtension,
    isCheckingExtension,
    isExtensionInstalled: isInstalled,
    async connect() {
      await connect({ provider: "injected" });
    },
    async disconnect() {
      await disconnect();
    },
    async signMessage(message) {
      if (!isAvailable || !solana.isConnected) {
        throw new Error("Phantom is not connected yet.");
      }

      const { signature } = await solana.signMessage(message);
      return signature;
    },
    async signAndSendTransaction(transaction) {
      if (!isAvailable || !solana.isConnected) {
        throw new Error("Phantom is not connected yet.");
      }

      const { signature } = await solana.signAndSendTransaction(transaction);
      return signature;
    },
    getAddress() {
      return address;
    },
  };
}
