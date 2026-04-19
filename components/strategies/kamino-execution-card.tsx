"use client";

import { startTransition, useState } from "react";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

import {
  useMirevSession,
  type SessionData,
} from "@/lib/hooks/use-mirev-session";
import type { StrategyExecutionMode } from "@/lib/strategies/types";

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

type KaminoExecutionCardProps = {
  initialSession: SessionData | null;
  executionMode: StrategyExecutionMode;
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

export function KaminoExecutionCard({
  initialSession,
  executionMode,
}: KaminoExecutionCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("25");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const {
    connectedAddress,
    session,
    hasActiveWalletSession,
    hasSessionMismatch,
  } = useMirevSession(initialSession);

  async function runAction(action: "deposit" | "withdraw") {
    if (!session) {
      setError("Sign in with your wallet before preparing Kamino actions.");
      return;
    }

    if (
      executionMode === "live" &&
      (!connected || !publicKey || !sendTransaction)
    ) {
      setError("Connect the wallet that should sign this Kamino transaction.");
      return;
    }

    if (executionMode === "live" && !hasActiveWalletSession) {
      setError(
        "The connected wallet must match the signed Mirev session before funds can move.",
      );
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const prepareResponse = await fetch("/api/strategies/kamino/prepare", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action,
          amount,
          executionMode,
        }),
      });

      const preparePayload = (await prepareResponse.json()) as
        | PreparedTransactionResponse
        | { error: string };

      if (!prepareResponse.ok || "error" in preparePayload) {
        throw new Error(
          "error" in preparePayload
            ? preparePayload.error
            : "Could not prepare the Kamino transaction.",
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

      const finalizeResponse = await fetch("/api/strategies/kamino/finalize", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          actionId: preparePayload.actionId,
          txSignature,
        }),
      });

      const finalizePayload = (await finalizeResponse.json()) as
        | { status: string; txSignature: string }
        | { error: string };

      if (!finalizeResponse.ok || "error" in finalizePayload) {
        throw new Error(
          "error" in finalizePayload
            ? finalizePayload.error
            : "Kamino action completed, but Mirev could not log the result.",
        );
      }

      setLastSummary(
        `${preparePayload.summary} Signature ${finalizePayload.txSignature} was logged in Mirev's feed.`,
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["auth-session"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["wallet-token-balances"],
        }),
      ]);
      startTransition(() => {
        router.refresh();
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Kamino action failed unexpectedly.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
        Kamino Controls
      </p>
      <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
        <button
          type="button"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("mode", "mock");
            router.replace(`/?${searchParams.toString()}`, { scroll: false });
          }}
          className={`rounded-full px-4 py-2 transition ${executionMode === "mock" ? "bg-slate-950 text-white" : "text-slate-600"}`}
        >
          Mock
        </button>
        <button
          type="button"
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("mode", "live");
            router.replace(`/?${searchParams.toString()}`, { scroll: false });
          }}
          className={`rounded-full px-4 py-2 transition ${executionMode === "live" ? "bg-slate-950 text-white" : "text-slate-600"}`}
        >
          Live
        </button>
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {executionMode === "live"
          ? "Prepare live user-signed actions"
          : "Preview the Kamino flow in mock mode"}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {executionMode === "live"
          ? "Mirev prepares the Kamino transaction, then the connected wallet signs the real onchain action. Deposits move USDC into Earn, and withdrawals route it back to Spend."
          : "Mock mode uses the same Mirev workflow and feed logging, but it never sends an onchain transaction or spends funds."}
      </p>

      <label className="mt-6 block">
        <span className="text-xs tracking-[0.2em] text-slate-500 uppercase">
          Amount in USDC
        </span>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          className="mt-2 h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm text-slate-900 transition outline-none focus:border-slate-950"
          placeholder="25"
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runAction("deposit")}
          disabled={isPending}
          className="h-11 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Working..." : "Deposit To Earn"}
        </button>
        <button
          type="button"
          onClick={() => runAction("withdraw")}
          disabled={isPending}
          className="h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          Withdraw To Spend
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Session Wallet
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {session?.walletAddress ?? "No signed session"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Connected Wallet
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {connectedAddress ?? "No wallet connected"}
          </p>
        </div>
      </div>

      {executionMode === "live" && !hasActiveWalletSession ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {hasSessionMismatch
            ? "Wallet changed. Sign in with the connected wallet before using live Kamino controls."
            : "Live Kamino actions are only enabled when the connected wallet matches the signed Mirev session."}
        </p>
      ) : null}

      {executionMode === "mock" ? (
        <p className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Mock mode is active. Mirev will simulate the prepared deposit and
          withdrawal flow and still write the result into the automation feed.
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
