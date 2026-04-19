import { AuthCard } from "@/components/auth/auth-card";
import { KaminoExecutionCard } from "@/components/strategies/kamino-execution-card";
import { getCurrentSession } from "@/lib/auth";
import { getDatabaseStatus } from "@/lib/database-status";
import { resolveExecutionMode } from "@/lib/strategies/execution-mode";
import {
  formatApyCopy,
  formatExecutionCopy,
  formatLiquidityCopy,
  formatStrategyRouteCopy,
  getRecentStrategyExecutionLogs,
} from "@/lib/strategies/feed";
import { kaminoStrategyAdapter } from "@/lib/strategies/kamino-strategy-adapter";

export const dynamic = "force-dynamic";

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "slate";
}) {
  const tones = {
    green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-100 text-amber-800 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase ring-1 ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const executionMode = resolveExecutionMode(resolvedSearchParams?.mode);
  const [status, session, apyQuote, liquidityState] = await Promise.all([
    getDatabaseStatus(),
    getCurrentSession(),
    kaminoStrategyAdapter.getApy(),
    kaminoStrategyAdapter.getLiquidityState(),
  ]);
  const recentExecutions = await getRecentStrategyExecutionLogs(
    session?.userId ?? null,
  );
  const strategy = kaminoStrategyAdapter.config;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7efe5_0%,#f5f7fb_42%,#eef2f7_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium tracking-[0.24em] text-slate-500 uppercase">
                Mirev Infrastructure
              </p>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                  Mirev now has its first approved earn venue.
                </h1>
                <p className="text-base leading-7 text-slate-600">
                  The MVP routes idle USDC from the Earn bucket into{" "}
                  <span className="font-semibold text-slate-900">
                    {strategy.protocol}
                  </span>{" "}
                  while Spend stays liquid and available-now logic stays in
                  Mirev.
                </p>
              </div>
            </div>
            <StatusPill
              label={
                status.connected
                  ? "Connected"
                  : status.configured
                    ? "Configured"
                    : "Needs Env"
              }
              tone={
                status.connected
                  ? "green"
                  : status.configured
                    ? "amber"
                    : "slate"
              }
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              Database
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {strategy.protocol}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lending venue chosen for MVP earn routing on Solana with USDC as
              the first supported earn asset.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              ORM
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {strategy.token} Supply
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Earn funds are supplied into Kamino Lend as the first strategy
              rail, while Spend and Save remain outside the yield venue.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              Target
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {strategy.id}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {strategy.summary}
            </p>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
            <p className="text-sm tracking-[0.24em] text-slate-300 uppercase">
              Connection Check
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {status.connected
                ? "Database and strategy scaffolding are ready."
                : "Strategy scaffolding is ready, but connectivity still needs attention."}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {formatStrategyRouteCopy(strategy.summary)}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs tracking-[0.22em] text-slate-400 uppercase">
                  Liquidity behavior
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {formatLiquidityCopy(liquidityState)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs tracking-[0.22em] text-slate-400 uppercase">
                  APY source
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {formatApyCopy(apyQuote)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <StatusPill
                label={executionMode === "live" ? "Live Mode" : "Mock Mode"}
                tone={executionMode === "live" ? "amber" : "green"}
              />
            </div>
          </article>

          <AuthCard initialSession={session} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              Approved Earn Rail
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {strategy.protocol}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {strategy.riskNote}
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                Dashboard language
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Earn funds are routed to Kamino Lend.
              </p>
            </div>
          </article>

          <KaminoExecutionCard
            initialSession={session}
            executionMode={executionMode}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              Automation Feed
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {recentExecutions.length > 0 ? (
                recentExecutions.map((execution) => (
                  <p key={execution.id}>{formatExecutionCopy(execution)}</p>
                ))
              ) : (
                <p>
                  No Kamino actions have been prepared yet. Sign in, then use
                  mock mode for demos or live mode for real Kamino deposits and
                  withdrawals.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm tracking-[0.2em] text-slate-500 uppercase">
              What To Test Now
            </p>
            <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <li>
                1. Start local Postgres with `pnpm db:up` if it is not already
                running.
              </li>
              <li>
                2. Sign into Mirev with the wallet you want attached to the
                session.
              </li>
              <li>
                3. Use mock mode to demo the flow without spending funds, or
                switch to live mode when you are ready.
              </li>
              <li>
                4. Confirm the resulting action appears in the automation feed
                after refresh.
              </li>
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
