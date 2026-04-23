"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  isWalletRejectionError,
  useAppWallet,
  useSolanaConnection,
} from "@/lib/hooks/use-app-wallet";
import { useSession, type SessionData } from "@/lib/hooks/use-session";

type PreparedTransactionResponse = {
  actionId: string;
  serializedTransaction: string | null;
  summary: string;
};

type EarnActionPanelProps = {
  initialSession: SessionData | null;
};

type Tab = "deposit" | "withdraw";

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

export function EarnActionPanel({ initialSession }: EarnActionPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const connection = useSolanaConnection();
  const wallet = useAppWallet();

  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("25");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const { session, hasActiveWalletSession, hasSessionMismatch } =
    useSession(initialSession);

  async function runAction() {
    if (!session) {
      setError("Sign in with Phantom before preparing Kamino actions.");
      return;
    }
    if (!wallet.isConnected || !wallet.address) {
      setError("Connect Phantom before signing this transaction.");
      return;
    }
    if (!hasActiveWalletSession) {
      setError("Connected wallet must match the signed Mirev session.");
      return;
    }

    setError(null);
    setLastSummary(null);
    setIsPending(true);
    try {
      const prepareResponse = await fetch("/api/strategies/kamino/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: tab, amount }),
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

      if (!preparePayload.serializedTransaction) {
        throw new Error("Kamino did not return a transaction payload.");
      }

      const transaction = deserializeTransaction(
        preparePayload.serializedTransaction,
      );
      const txSignature = await wallet.signAndSendTransaction(transaction);
      await connection.confirmTransaction(txSignature, "confirmed");

      const finalizeResponse = await fetch("/api/strategies/kamino/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
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
        `${preparePayload.summary} Signature ${finalizePayload.txSignature.slice(0, 8)}… logged in the feed.`,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth-session"] }),
        queryClient.invalidateQueries({ queryKey: ["wallet-token-balances"] }),
      ]);
      startTransition(() => router.refresh());
    } catch (cause) {
      if (isWalletRejectionError(cause)) {
        setError("Phantom signature request was canceled.");
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : "Action failed unexpectedly.",
        );
      }
    } finally {
      setIsPending(false);
    }
  }

  const disabled =
    isPending ||
    !session ||
    !wallet.isConnected ||
    !wallet.address ||
    !hasActiveWalletSession;

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Earn Actions
        </p>
        <span className="text-xs font-semibold tracking-wide text-gray-400">
          LIVE
        </span>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="mt-5">
          {(["deposit", "withdraw"] as const).map((option) => (
            <TabsTrigger key={option} value={option}>
              {option}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <label className="mt-6 block">
        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Amount
        </span>
        <div className="mt-2 flex items-center rounded-2xl border border-gray-200 px-4 focus-within:border-gray-900">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="h-12 flex-1 bg-transparent text-lg font-semibold text-gray-900 outline-none"
            placeholder="0"
          />
          <span className="text-sm font-semibold text-gray-400">USDC</span>
        </div>
      </label>

      <button
        type="button"
        onClick={runAction}
        disabled={disabled}
        className="mt-5 h-12 w-full rounded-2xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {isPending
          ? "Working..."
          : tab === "deposit"
            ? "Deposit To Earn"
            : "Withdraw To Spend"}
      </button>

      {!session ? (
        <p className="mt-4 text-xs leading-5 text-gray-500">
          Connect Phantom and sign in from top-right menu to enable actions.
        </p>
      ) : !hasActiveWalletSession ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {hasSessionMismatch
            ? "Phantom account changed. Re-sign with connected account."
            : "Connect Phantom account matching your signed session."}
        </p>
      ) : null}

      {lastSummary ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {lastSummary}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </article>
  );
}
