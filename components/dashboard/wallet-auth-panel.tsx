import type { SessionData } from "@/lib/hooks/use-session";
import { shortenAddress } from "@/lib/solana/shorten-address";
import { Button } from "../ui/button";

type WalletAuthPanelProps = {
  connected: boolean;
  connectedAddress: string | null;
  error: string | null;
  hasActiveWalletSession: boolean;
  hasSessionMismatch: boolean;
  isPending: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  session: SessionData | null;
};

export function WalletAuthPanel({
  connected,
  connectedAddress,
  error,
  hasActiveWalletSession,
  hasSessionMismatch,
  isPending,
  onSignIn,
  onSignOut,
  session,
}: WalletAuthPanelProps) {
  if (session && hasActiveWalletSession) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
          Mirev active
        </div>

        <div className="rounded-[28px] bg-white/6 px-5 py-5">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            Wallet
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {shortenAddress(session.walletAddress)}
          </p>
        </div>

        <p className="text-sm leading-6 text-white/60">
          Phantom wallet connected. Mirev session ready.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            disabled={isPending}
            className="h-11 rounded-full border-white/10 bg-white/6 px-5 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            Sign Out
          </Button>
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
        {hasSessionMismatch ? "Session needs attention" : "Phantom connected"}
      </div>

      {connectedAddress ? (
        <p className="text-sm font-medium text-white">
          {shortenAddress(connectedAddress)}
        </p>
      ) : null}

      <p className="mx-auto max-w-sm text-sm leading-6 text-white/60">
        One secure message to activate Mirev. No funds move.
      </p>

      {hasSessionMismatch ? (
        <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Current Mirev session belongs to different wallet. Continue to switch
          over.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={onSignIn}
          disabled={!connected || isPending}
          className="h-11 min-w-52 rounded-full bg-white px-5 text-sm font-semibold text-gray-950 hover:bg-white/90 disabled:bg-white/15 disabled:text-white/40"
        >
          {isPending
            ? "Waiting For Phantom..."
            : hasSessionMismatch
              ? "Switch To This Wallet"
              : "Activate Mirev"}
        </Button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
