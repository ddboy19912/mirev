"use client";

import { AddressType, ConnectButton } from "@phantom/react-sdk";
import { useEffect, useRef, useState } from "react";
import { WalletAuthModal } from "@/components/dashboard/wallet-auth-modal";
import { Button } from "@/components/ui/button";
import { useAppWallet } from "@/lib/hooks/use-app-wallet";
import { useSession, type SessionData } from "@/lib/hooks/use-session";

type WalletButtonProps = {
  initialSession: SessionData | null;
};

export function WalletButton({ initialSession }: WalletButtonProps) {
  const [open, setOpen] = useState(false);
  const wallet = useAppWallet();
  const { session, hasActiveWalletSession, hasSessionMismatch } =
    useSession(initialSession);
  const previousConnectedRef = useRef(wallet.isConnected);

  useEffect(() => {
    const wasConnected = previousConnectedRef.current;
    const justConnected = !wasConnected && wallet.isConnected;

    if (justConnected && !hasActiveWalletSession && !session) {
      const timer = window.setTimeout(() => {
        setOpen(true);
      }, 0);

      previousConnectedRef.current = wallet.isConnected;
      return () => window.clearTimeout(timer);
    }

    if (!wallet.isConnected && open) {
      const timer = window.setTimeout(() => {
        setOpen(false);
      }, 0);

      previousConnectedRef.current = wallet.isConnected;
      return () => window.clearTimeout(timer);
    }

    previousConnectedRef.current = wallet.isConnected;
  }, [wallet.isConnected, hasActiveWalletSession, session, open]);

  return (
    <>
      <div className="flex items-center gap-2">
        <ConnectButton addressType={AddressType.solana} />
        {wallet.isConnected ? (
          <Button
            type="button"
            variant={hasSessionMismatch ? "destructive" : "outline"}
            onClick={() => setOpen(true)}
            className="h-9 rounded-full px-4 text-xs font-semibold tracking-wide"
          >
            {session
              ? "Mirev Session"
              : hasActiveWalletSession
                ? "Mirev Session"
                : hasSessionMismatch
                  ? "Fix Session"
                  : "Activate Mirev"}
          </Button>
        ) : null}
      </div>
      <WalletAuthModal
        open={open}
        onClose={() => setOpen(false)}
        initialSession={initialSession}
      />
    </>
  );
}
