"use client";

import { useAssetAllocation } from "@/lib/hooks/use-asset-allocation";
import type { SessionData } from "@/lib/hooks/use-session";
import {
  AUTOPILOT_PROFILES,
  type AutopilotProfile,
} from "@/lib/treasury/profiles";
import { cn } from "@/lib/utils";

type AssetAllocationCardProps = {
  initialSession: SessionData | null;
};

function AllocationAmount({
  label,
  amount,
  tone = "default",
  symbol,
}: {
  label: string;
  amount: string;
  tone?: "default" | "earn";
  symbol: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-lg font-bold",
          tone === "earn" ? "text-emerald-600" : "text-gray-900",
        )}
      >
        {amount} {symbol}
      </p>
    </div>
  );
}

function ProfileSelector({
  profile,
  onChange,
}: {
  profile: AutopilotProfile;
  onChange: (profile: AutopilotProfile) => void;
}) {
  return (
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
          onClick={() => onChange(key)}
          className={cn(
            "rounded-2xl border p-4 text-left transition",
            profile === key
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{preset.label}</p>
              <p
                className={cn(
                  "mt-1 text-sm",
                  profile === key ? "text-gray-300" : "text-gray-500",
                )}
              >
                {preset.description}
              </p>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase opacity-60">
              {preset.spendPercent}/{preset.savePercent}/{preset.earnPercent}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function AssetAllocationCard({
  initialSession,
}: AssetAllocationCardProps) {
  const {
    assetDescriptor,
    assetBalance,
    allocationPreview,
    balanceQuery,
    connected,
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
  } = useAssetAllocation({
    initialSession,
    assetSymbol: "USDC",
  });

  const supportedAssetLabel = `${assetDescriptor.symbol} on Solana`;

  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Asset Allocation
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            Allocate supported assets
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            Mirev is designed to manage wallet assets across Spend, Save, and
            Earn. Today, live allocation supports {supportedAssetLabel}, while
            the product language stays broader for future asset support.
          </p>
        </div>
        <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-600">
          Supported today: {supportedAssetLabel}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Supported asset balance
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {assetBalance
              ? `${assetBalance.balance} ${assetDescriptor.symbol}`
              : "--"}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {assetBalance
              ? `Last refreshed ${new Date(assetBalance.refreshedAt).toLocaleTimeString()}`
              : balanceQuery.isError
                ? `Could not read ${assetDescriptor.symbol} from the portfolio provider.`
                : connectedAddress && balanceQuery.isFetching
                  ? `Reading ${assetDescriptor.symbol} balance...`
                  : connectedAddress
                    ? `Refresh to load the latest ${assetDescriptor.symbol} amount.`
                    : "Connect a wallet to read supported asset balances."}
          </p>
          {assetBalance && assetBalance.usdValue !== null ? (
            <p className="mt-2 text-xs text-gray-400">
              Approximate value ${assetBalance.usdValue.toFixed(2)}
            </p>
          ) : null}
          {balanceQuery.error ? (
            <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {balanceQuery.error.message}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Session status
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {hasActiveWalletSession
              ? "Signed in with this wallet"
              : hasSessionMismatch
                ? "Session belongs to another wallet"
                : session
                  ? "Reconnect this wallet to continue"
                  : "No signed session"}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Live routing is available today for {assetDescriptor.symbol}. More
            supported assets can slot into this same flow later.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void balanceQuery.refetch()}
          disabled={!connectedAddress || balanceQuery.isFetching}
          className="h-10 rounded-full border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300"
        >
          {balanceQuery.isFetching ? "Reading Balance..." : "Refresh Balance"}
        </button>
      </div>

      <ProfileSelector profile={profile} onChange={setProfile} />

      <div className="mt-6 rounded-2xl bg-gray-50 p-4">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Allocation preview
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <AllocationAmount
            label="Spend"
            amount={allocationPreview.spendAmount}
            symbol={assetDescriptor.symbol}
          />
          <AllocationAmount
            label="Save"
            amount={allocationPreview.saveAmount}
            symbol={assetDescriptor.symbol}
          />
          <AllocationAmount
            label="Earn"
            amount={allocationPreview.earnAmount}
            symbol={assetDescriptor.symbol}
            tone="earn"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={allocate}
        disabled={
          isPending ||
          !connected ||
          !connectedAddress ||
          !hasActiveWalletSession ||
          !assetBalance ||
          Number(assetBalance.balance) <= 0
        }
        className="mt-6 h-12 w-full rounded-full bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {isPending ? "Allocating..." : `Allocate ${assetDescriptor.symbol}`}
      </button>

      {hasSessionMismatch ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The connected wallet changed. Sign in again with this wallet before
          allocating funds.
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
