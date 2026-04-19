"use client";

import { startTransition, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import bs58 from "bs58";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  useMirevSession,
  type SessionData,
} from "@/lib/hooks/use-mirev-session";

type AuthCardProps = {
  initialSession: SessionData | null;
};

type ChallengeResponse = {
  message: string;
};

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function AuthCard({ initialSession }: AuthCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { publicKey, connected, signMessage, wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    connectedAddress,
    session,
    hasActiveWalletSession,
    hasSessionMismatch,
  } = useMirevSession(initialSession);

  async function handleSignIn() {
    if (!publicKey || !signMessage) {
      setError("Connect a wallet that supports message signing first.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const walletAddress = publicKey.toBase58();

      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          walletType: wallet?.adapter.name ?? "solana",
        }),
      });

      if (!challengeResponse.ok) {
        throw new Error("Could not create a sign-in challenge.");
      }

      const challenge = (await challengeResponse.json()) as ChallengeResponse;
      const signatureBytes = await signMessage(
        new TextEncoder().encode(challenge.message),
      );

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          signature: bs58.encode(signatureBytes),
        }),
      });

      const verifyPayload = (await verifyResponse.json()) as
        | SessionData
        | { error: string };

      if (!verifyResponse.ok || "error" in verifyPayload) {
        throw new Error(
          "error" in verifyPayload
            ? verifyPayload.error
            : "Could not verify the wallet signature.",
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["auth-session"],
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Sign-in failed unexpectedly.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleLogout() {
    setError(null);
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      await queryClient.invalidateQueries({
        queryKey: ["auth-session"],
      });
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Could not end the current session.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
        Wallet Auth
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Wallet connect + signed session
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Connect a Solana wallet, sign a nonce-based message, and Mirev will
        issue an HttpOnly session cookie backed by Postgres.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <WalletMultiButton className="!h-11 !rounded-full !bg-slate-950 !px-5 !text-sm !font-semibold hover:!bg-slate-800" />
        <button
          type="button"
          onClick={handleSignIn}
          disabled={
            !connected || !signMessage || isPending || hasActiveWalletSession
          }
          className="h-11 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {isPending
            ? "Working..."
            : hasActiveWalletSession
              ? "Session Active"
              : hasSessionMismatch
                ? "Sign In This Wallet"
                : "Sign In"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={!session || isPending}
          className="h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Connected Wallet
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {connectedAddress
              ? shortenAddress(connectedAddress)
              : "Not connected"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
            Session
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {session
              ? shortenAddress(session.walletAddress)
              : "No active session"}
          </p>
        </div>
      </div>

      {session ? (
        <p className="mt-5 text-sm leading-7 text-slate-600">
          Signed in as{" "}
          <span className="font-semibold text-slate-900">
            {shortenAddress(session.walletAddress)}
          </span>
          . Session expires at{" "}
          <span className="font-semibold text-slate-900">
            {new Date(session.expiresAt).toLocaleString()}
          </span>
          .
        </p>
      ) : null}

      {hasSessionMismatch ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Connected wallet and signed session do not match. Sign in with the
          newly connected wallet before allocating or routing funds.
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
