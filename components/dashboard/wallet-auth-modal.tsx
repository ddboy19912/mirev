"use client";

import { startTransition, useEffect, useState } from "react";
import bs58 from "bs58";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  isWalletRejectionError,
  useAppWallet,
} from "@/lib/hooks/use-app-wallet";
import { useSession, type SessionData } from "@/lib/hooks/use-session";
import { WalletAuthPanel } from "@/components/dashboard/wallet-auth-panel";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

type ChallengeResponse = { message: string };

type WalletAuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialSession: SessionData | null;
};

export function WalletAuthModal({
  open,
  onClose,
  initialSession,
}: WalletAuthModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const wallet = useAppWallet();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    connectedAddress,
    session,
    hasActiveWalletSession,
    hasSessionMismatch,
  } = useSession(initialSession);

  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSignIn() {
    if (!wallet.address || !wallet.isConnected) {
      setError("Connect Phantom before signing in.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const walletAddress = wallet.address;
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          walletType: "phantom",
        }),
      });

      if (!challengeResponse.ok) {
        throw new Error("Could not create a Phantom sign-in challenge.");
      }

      const challenge = (await challengeResponse.json()) as ChallengeResponse;
      const signatureBytes = await wallet.signMessage(
        new TextEncoder().encode(challenge.message),
      );
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
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
            : "Could not verify the Phantom signature.",
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      startTransition(() => router.refresh());
    } catch (cause) {
      setError(
        isWalletRejectionError(cause)
          ? "Phantom signature request was canceled."
          : cause instanceof Error
            ? cause.message
            : "Phantom sign-in failed unexpectedly.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleSignOut() {
    setError(null);
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      startTransition(() => router.refresh());
      onClose();
    } catch {
      setError("Could not end the current Mirev session.");
    } finally {
      setIsPending(false);
    }
  }

  const title = session ? "Manage Mirev Session" : "Activate Mirev";
  const description = session
    ? "Phantom wallet stays managed by Phantom UI. This panel only manages Mirev app session."
    : "Wallet connected in Phantom. Finish with one quick message signature for Mirev.";

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      label=""
      title={title}
      description={description}
      contentClassName="max-w-[690px] rounded-[32px] border-white/8 bg-[#1c1c1d] px-12 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
      mobileContentClassName="rounded-t-[32px] border-white/8 bg-[#1c1c1d] px-1 pb-8"
      labelClassName="hidden"
      titleClassName="text-center text-[22px] font-medium tracking-tight text-white"
      descriptionClassName="mt-4 text-center text-base leading-7 text-white/55"
      closeButtonClassName="text-white/50 hover:bg-transparent hover:text-white"
    >
      <WalletAuthPanel
        connected={wallet.isConnected}
        connectedAddress={connectedAddress}
        error={error}
        hasActiveWalletSession={hasActiveWalletSession}
        hasSessionMismatch={hasSessionMismatch}
        isPending={isPending}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        session={session}
      />
    </ResponsiveDialog>
  );
}
