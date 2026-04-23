"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppWallet } from "@/lib/hooks/use-app-wallet";

export type SessionData = {
  sessionId: string;
  userId: string;
  walletAddress: string;
  expiresAt: string;
};

type SessionResponse = {
  authenticated: boolean;
  session: SessionData | null;
};

async function fetchSession() {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not refresh the current session.");
  }

  return (await response.json()) as SessionResponse;
}

export function useSession(initialSession: SessionData | null) {
  const wallet = useAppWallet();
  const connectedAddress = wallet.address;

  const query = useQuery({
    queryKey: ["auth-session", connectedAddress ?? "disconnected"],
    queryFn: fetchSession,
    initialData: {
      authenticated: Boolean(initialSession),
      session: initialSession,
    } satisfies SessionResponse,
  });

  const session = query.data.session;
  const hasSessionMismatch = Boolean(
    session && connectedAddress && session.walletAddress !== connectedAddress,
  );
  const hasActiveWalletSession = Boolean(
    session && connectedAddress && session.walletAddress === connectedAddress,
  );

  return {
    ...query,
    connectedAddress,
    session,
    hasSessionMismatch,
    hasActiveWalletSession,
  };
}
