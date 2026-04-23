import Link from "next/link";

export const FinalCta = () => {
  return (
    <section className="border-b border-gray-100 px-8 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-gray-900">
          Ready to automate
          <br />
          your assets?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-500">
          Connect your Solana wallet, pick a profile, and let Mirev do the rest.
          Live support starts with USDC today. No fees to start. Non-custodial
          from day one.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Launch App →
        </Link>
      </div>
    </section>
  );
};
