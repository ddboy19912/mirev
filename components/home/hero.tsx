import Link from "next/link";

export const Hero = () => {
  return (
    <section className="border-b border-gray-100 px-8 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Stablecoin autopilot · Built on Solana
          </p>
          <h1 className="mt-5 text-[3.75rem] leading-[1.08] font-bold tracking-[-0.04em] text-gray-900">
            Your money.
            <br />
            <span className="text-gray-300">On autopilot.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-gray-500">
            Mirev is built to organize stablecoin assets into spend, save, and
            earn buckets. Today, live support starts with USDC on Solana,
            routing idle funds into transparent onchain yield while keeping
            daily liquidity instantly available.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/app"
              className="rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Launch App →
            </Link>
            <span className="text-sm text-gray-400">
              Non-custodial · No fees to start
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Total Balance
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              $2,400.00
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Supported today: USDC · Balanced profile
            </p>
          </div>

          <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full">
            <div className="bg-blue-400" style={{ width: "45%" }} />
            <div className="bg-violet-400" style={{ width: "30%" }} />
            <div className="bg-emerald-400" style={{ width: "25%" }} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-500">SPEND</p>
              <p className="mt-2 text-xl font-bold text-gray-900">$1,080</p>
              <p className="mt-0.5 text-xs text-gray-400">45% · liquid</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-xs font-semibold text-violet-500">SAVE</p>
              <p className="mt-2 text-xl font-bold text-gray-900">$720</p>
              <p className="mt-0.5 text-xs text-gray-400">30% · reserved</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-600">EARN</p>
              <p className="mt-2 text-xl font-bold text-emerald-600">$600</p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-500">
                5.2% APY
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-xs font-semibold text-gray-500">
                Autopilot active
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              $600 routed to Kamino via Earn bucket
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
