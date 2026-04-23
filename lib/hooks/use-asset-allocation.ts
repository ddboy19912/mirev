"use client";

import { startTransition, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

import {
  isWalletRejectionError,
  useAppWallet,
  useSolanaConnection,
} from "@/lib/hooks/use-app-wallet";
import { useSession, type SessionData } from "@/lib/hooks/use-session";
import {
  TOKEN_REGISTRY,
  type SupportedTokenSymbol,
} from "@/lib/portfolio/tokens";
import { useWalletTokenBalances } from "@/lib/hooks/use-wallet-token-balances";
import {
  AUTOPILOT_PROFILES,
  type AutopilotProfile,
  calculateAllocation,
} from "@/lib/treasury/profiles";

type AllocationResponse = {
  walletBalance: {
    balance: string;
    symbol: string;
    usdValue: number | null;
    refreshedAt: string;
  };
  profile: AutopilotProfile;
  totalAmount: string;
  spendAmount: string;
  saveAmount: string;
  earnAmount: string;
  strategyAllocationId: string | null;
};

type PreparedTransactionResponse = {
  actionId: string;
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

function decodeBase64(payload: string) {
  const decoded = atob(payload);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function deserializeTransaction(serializedTransaction: string) {
  const bytes = decodeBase64(serializedTransaction);

  try {
    return VersionedTransaction.deserialize(bytes);
  } catch {
    return Transaction.from(bytes);
  }
}

export function useAssetAllocation({
  initialSession,
  assetSymbol = "USDC",
}: {
  initialSession: SessionData | null;
  assetSymbol?: SupportedTokenSymbol;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const connection = useSolanaConnection();
  const wallet = useAppWallet();
  const [profile, setProfile] = useState<AutopilotProfile>("balanced");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const {
    connectedAddress,
    session,
    hasActiveWalletSession,
    hasSessionMismatch,
  } = useSession(initialSession);
  const balanceQuery = useWalletTokenBalances({
    tokens: [assetSymbol],
  });

  const assetDescriptor = TOKEN_REGISTRY[assetSymbol];
  const assetBalance = balanceQuery.data?.balances[0] ?? null;

  const allocationPreview = useMemo(() => {
    const totalAmount = Number(assetBalance?.balance ?? "0");

    return calculateAllocation({
      totalAmount,
      profile,
    });
  }, [assetBalance?.balance, profile]);

  async function allocate() {
    if (!connectedAddress || !session || !hasActiveWalletSession) {
      setError(
        "Sign in with the currently connected Phantom account before allocating funds.",
      );
      return;
    }

    if (!assetBalance || Number(assetBalance.balance) <= 0) {
      setError(
        `This wallet does not currently have allocatable ${assetDescriptor.symbol}.`,
      );
      return;
    }

    if (!wallet.isConnected || !wallet.address) {
      setError("Connect Phantom before signing the Kamino route.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const allocationResponse = await fetch("/api/deposits/allocate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: connectedAddress,
          profile,
        }),
      });

      const allocationPayload = (await allocationResponse.json()) as
        | AllocationResponse
        | { error: string };

      if (!allocationResponse.ok || "error" in allocationPayload) {
        throw new Error(
          "error" in allocationPayload
            ? allocationPayload.error
            : "Could not allocate the connected wallet balance.",
        );
      }

      if (Number(allocationPayload.earnAmount) > 0) {
        const prepareResponse = await fetch("/api/strategies/kamino/prepare", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            action: "deposit",
            amount: allocationPayload.earnAmount,
            strategyAllocationId: allocationPayload.strategyAllocationId,
          }),
        });

        const preparePayload = (await prepareResponse.json()) as
          | PreparedTransactionResponse
          | { error: string };

        if (!prepareResponse.ok || "error" in preparePayload) {
          throw new Error(
            "error" in preparePayload
              ? preparePayload.error
              : "Could not prepare the Kamino allocation route.",
          );
        }

        if (!preparePayload.serializedTransaction) {
          throw new Error("Kamino did not return a transaction payload.");
        }

        const transaction = deserializeTransaction(
          preparePayload.serializedTransaction,
        );
        const txSignature = await wallet.signAndSendTransaction(transaction);
        await connection.confirmTransaction(txSignature, "confirmed");

        const finalizeResponse = await fetch(
          "/api/strategies/kamino/finalize",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              actionId: preparePayload.actionId,
              txSignature,
              strategyAllocationId: allocationPayload.strategyAllocationId,
            }),
          },
        );

        const finalizePayload = (await finalizeResponse.json()) as
          | { txSignature: string }
          | { error: string };

        if (!finalizeResponse.ok || "error" in finalizePayload) {
          throw new Error(
            "error" in finalizePayload
              ? finalizePayload.error
              : "Allocation succeeded, but Kamino routing could not be finalized.",
          );
        }

        setLastSummary(
          `Allocated ${allocationPayload.totalAmount} ${assetDescriptor.symbol} using the ${AUTOPILOT_PROFILES[profile].label} profile and routed ${allocationPayload.earnAmount} ${assetDescriptor.symbol} into Kamino. Signature ${finalizePayload.txSignature}.`,
        );
      } else {
        setLastSummary(
          `Allocated ${allocationPayload.totalAmount} ${assetDescriptor.symbol} using the ${AUTOPILOT_PROFILES[profile].label} profile. No Earn amount was large enough to route.`,
        );
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["wallet-token-balances"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["auth-session"],
        }),
      ]);

      startTransition(() => {
        router.refresh();
      });
    } catch (cause) {
      if (isWalletRejectionError(cause)) {
        setError("Phantom signature request was canceled.");
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : "The asset allocation flow failed unexpectedly.",
        );
      }
    } finally {
      setIsPending(false);
    }
  }

  return {
    assetDescriptor,
    assetBalance,
    allocationPreview,
    balanceQuery,
    connected: wallet.isConnected,
    connectedAddress,
    error,
    hasActiveWalletSession,
    hasSessionMismatch,
    isPending,
    lastSummary,
    profile,
    session,
    setProfile,
    allocate,
  };
}
