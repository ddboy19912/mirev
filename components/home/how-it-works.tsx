export const HowItWorks = () => {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-gray-900">
            Three steps to set it and forget it.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, title, body }) => (
            <div key={step}>
              <p className="text-5xl font-bold tracking-tight text-gray-100">
                {step}
              </p>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect your wallet",
    body: "Link any Solana wallet in one click. Mirev reads supported asset balances while you stay in control of your keys. Live support today starts with USDC.",
  },
  {
    step: "02",
    title: "Choose an autopilot profile",
    body: "Pick Safe, Balanced, or Growth. Each profile sets how supported balances are split across spend, save, and earn.",
  },
  {
    step: "03",
    title: "Mirev handles the rest",
    body: "Idle funds are routed into approved onchain yield automatically. Spend stays liquid — always available, no unwinding required.",
  },
] as const;
