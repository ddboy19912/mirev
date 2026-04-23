export const Trust = () => {
  return (
    <section className="bg-[#0d1117] px-8 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Built for trust
            </p>
            <h2 className="mt-4 text-4xl leading-[1.15] font-bold tracking-[-0.03em] text-white">
              Your keys.
              <br />
              Your funds.
              <br />
              <span className="text-gray-500">Always.</span>
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-gray-400">
              Mirev never takes custody. Every automated action is logged,
              visible, and reversible. You can withdraw from Earn back to Spend
              instantly, any time.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Non-custodial",
                body: "Funds stay in your wallet or in transparent onchain positions. Mirev prepares actions — you authorize them.",
              },
              {
                title: "Full audit trail",
                body: "Every allocation, route, and movement is written to your automation feed in plain language.",
              },
              {
                title: "Instant liquidity",
                body: "Move funds from Earn back to Spend at any time. No lockups, no delays, no forms to fill.",
              },
              {
                title: "Transparent yield",
                body: "One approved venue at launch — Kamino on Solana. You see exactly where your Earn funds go and why.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/6 bg-white/4 p-5"
              >
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1.5 text-sm leading-6 text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
