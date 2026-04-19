"use client";

import { startTransition, useMemo, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

import { useWalletTokenBalances } from "@/lib/hooks/use-wallet-token-balances";
import {
  AUTOPILOT_PROFILES,
  type AutopilotProfile,
  calculateAllocation,
} from "@/lib/treasury/profiles";
import {
  useMirevSession,
  type SessionData,
} from "@/lib/hooks/use-mirev-session";
import type { StrategyExecutionMode } from "@/lib/strategies/types";

type DepositFlowCardProps = {
  initialSession: SessionData | null;
  executionMode: StrategyExecutionMode;
};

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
  executionMode: StrategyExecutionMode;
  requiresUserSignature: boolean;
  serializedTransaction: string | null;
  encoding: "base64" | null;
  status: "awaiting_user_signature" | "mock_ready";
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

export function UsdcDepositFlowCard({
  initialSession,
  executionMode,
}: DepositFlowCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [profile, setProfile] = useState<AutopilotProfile>("balanced");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const {
    connectedAddress,
    session,
    hasActiveWalletSession,
    hasSessionMismatch,
  } = useMirevSession(initialSession);
  const balanceQuery = useWalletTokenBalances({
    tokens: ["USDC"],
  });
  const usdcBalance = balanceQuery.data?.balances[0] ?? null;
  const usdcUsdValue = usdcBalance?.usdValue ?? null;

  const allocationPreview = useMemo(() => {
    const totalAmount = Number(usdcBalance?.balance ?? "0");

    return calculateAllocation({
      totalAmount,
      profile,
    });
  }, [profile, usdcBalance?.balance]);

  async function handleAllocate() {
    if (!connectedAddress || !session || !hasActiveWalletSession) {
      setError(
        "Sign in with the currently connected wallet before allocating funds.",
      );
      return;
    }

    if (!usdcBalance || Number(usdcBalance.balance) <= 0) {
      setError("This wallet does not currently have allocatable USDC.");
      return;
    }

    if (
      executionMode === "live" &&
      (!connected || !publicKey || !sendTransaction)
    ) {
      setError("Connect the wallet that should sign the Kamino route.");
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
            executionMode,
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

        let txSignature: string;

        if (preparePayload.executionMode === "live") {
          if (!preparePayload.serializedTransaction) {
            throw new Error("Live mode did not return a transaction payload.");
          }

          const transaction = deserializeTransaction(
            preparePayload.serializedTransaction,
          );
          txSignature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(txSignature, "confirmed");
        } else {
          txSignature = `mock-${preparePayload.actionId}`;
        }

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
          `Allocated ${allocationPayload.totalAmount} USDC using the ${AUTOPILOT_PROFILES[profile].label} profile and routed ${allocationPayload.earnAmount} USDC into Kamino. Signature ${finalizePayload.txSignature}.`,
        );
      } else {
        setLastSummary(
          `Allocated ${allocationPayload.totalAmount} USDC using the ${AUTOPILOT_PROFILES[profile].label} profile. No Earn amount was large enough to route.`,
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
      setError(
        cause instanceof Error
          ? cause.message
          : "The deposit allocation flow failed unexpectedly.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
        Deposit Flow
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Read wallet USDC and allocate it
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Mirev reads the connected wallet&apos;s current USDC balance, lets you
        choose a profile, and routes only the Earn portion into Kamino while
        Spend and Save remain in-wallet.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Connected wallet USDC
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {usdcBalance ? `${usdcBalance.balance} USDC` : "--"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {usdcBalance
              ? `Last refreshed ${new Date(usdcBalance.refreshedAt).toLocaleTimeString()}`
              : balanceQuery.isError
                ? "Could not read USDC balance from the portfolio provider."
                : connectedAddress && balanceQuery.isFetching
                  ? "Reading USDC balance..."
                  : connectedAddress
                    ? "Refresh the wallet balance to load the latest USDC amount."
                    : "Connect a wallet to read its USDC balance."}
          </p>
          {usdcUsdValue !== null ? (
            <p className="mt-2 text-xs text-slate-500">
              Approximate value ${usdcUsdValue.toFixed(2)}
            </p>
          ) : null}
          {balanceQuery.error ? (
            <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {balanceQuery.error.message}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Session status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {hasActiveWalletSession
              ? "Signed in with this wallet"
              : hasSessionMismatch
                ? "Session belongs to another wallet"
                : session
                  ? "Reconnect this wallet to continue"
                  : "No signed session"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {executionMode === "live"
              ? "Live mode will request a real Kamino signature for the Earn portion."
              : "Mock mode will simulate the Kamino route without moving funds."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void balanceQuery.refetch()}
          disabled={!connectedAddress || balanceQuery.isFetching}
          className="h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {balanceQuery.isFetching ? "Reading Balance..." : "Refresh Balance"}
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {(
          Object.entries(AUTOPILOT_PROFILES) as [
            AutopilotProfile,
            (typeof AUTOPILOT_PROFILES)[AutopilotProfile],
          ][]
        ).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => setProfile(key)}
            className={`rounded-2xl border p-4 text-left transition ${
              profile === key
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{preset.label}</p>
                <p
                  className={`mt-1 text-sm ${profile === key ? "text-slate-200" : "text-slate-600"}`}
                >
                  {preset.description}
                </p>
              </div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase">
                {preset.spendPercent}/{preset.savePercent}/{preset.earnPercent}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
          Allocation preview
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">
              Spend
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {allocationPreview.spendAmount} USDC
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">
              Save
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {allocationPreview.saveAmount} USDC
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">
              Earn
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {allocationPreview.earnAmount} USDC
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAllocate}
        disabled={
          isPending ||
          !connectedAddress ||
          !hasActiveWalletSession ||
          !usdcBalance ||
          Number(usdcBalance.balance) <= 0
        }
        className="mt-6 h-12 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {isPending ? "Allocating..." : "Allocate Wallet USDC"}
      </button>

      {hasSessionMismatch ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The connected wallet changed. Sign in with this wallet in the auth
          card before allocating funds.
        </p>
      ) : null}

      {lastSummary ? (
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {lastSummary}
        </p>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </article>
  );
}
