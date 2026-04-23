import Link from "next/link";

import { cn } from "@/lib/utils";

export const TheSystem = () => {
  return (
    <section className="border-y border-gray-100 bg-gray-50 px-8 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              The system
            </p>
            <h2 className="mt-4 text-4xl leading-[1.15] font-bold tracking-[-0.03em] text-gray-900">
              Three buckets.
              <br />
              One balance.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-500">
              Every deposit is instantly allocated across three purpose-built
              buckets. You define the split once. Mirev keeps it in balance
              automatically from then on.
            </p>
            <Link
              href="/app"
              className="mt-8 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Try it now →
            </Link>
          </div>

          <div className="grid gap-4">
            {DATA.map(({ label, tagline, body, text, dot }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("h-2.5 w-2.5 rounded-full", dot)} />
                  <p className={cn("text-sm font-bold", text)}>{label}</p>
                </div>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {tagline}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DATA = [
  {
    color: "blue",
    label: "Spend",
    tagline: "Always liquid. Always available.",
    body: "Your everyday money. Stays in your wallet, accessible at any moment. No locks, no delays.",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-400",
  },
  {
    color: "violet",
    label: "Save",
    tagline: "Reserved and protected.",
    body: "A dedicated reserve buffer. Held aside from daily spending and not routed into yield strategies.",
    bg: "bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-400",
  },
  {
    color: "emerald",
    label: "Earn",
    tagline: "Idle funds, put to work.",
    body: "The portion above your liquidity buffer. Automatically routed into Kamino to earn transparent, reversible yield.",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-400",
  },
] as const;
