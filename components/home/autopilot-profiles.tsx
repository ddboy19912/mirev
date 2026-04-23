import Link from "next/link";

import { cn } from "@/lib/utils";

export const AutopilotProfiles = () => {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Autopilot profiles
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-gray-900">
            Choose how your money moves.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-500">
            One profile. Mirev uses it to split every deposit automatically.
            Change it any time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              label: "Safe",
              description:
                "Preserve a larger liquid buffer and route only a small portion into Earn.",
              spend: 60,
              save: 30,
              earn: 10,
              featured: false,
            },
            {
              label: "Balanced",
              description:
                "Keep healthy liquidity while still routing a meaningful slice into Earn.",
              spend: 45,
              save: 30,
              earn: 25,
              featured: true,
            },
            {
              label: "Growth",
              description:
                "Keep only a lean liquid buffer and push more idle USDC into Earn.",
              spend: 30,
              save: 20,
              earn: 50,
              featured: false,
            },
          ].map(({ label, description, spend, save, earn, featured }) => (
            <div
              key={label}
              className={cn(
                "rounded-3xl p-8",
                featured
                  ? "bg-gray-900 text-white"
                  : "border border-gray-100 bg-white",
              )}
            >
              {featured && (
                <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </p>
              )}
              <h3
                className={cn(
                  "text-2xl font-bold",
                  featured ? "text-white" : "text-gray-900",
                )}
              >
                {label}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm leading-6",
                  featured ? "text-gray-400" : "text-gray-500",
                )}
              >
                {description}
              </p>

              <div className="mt-6 flex h-2 overflow-hidden rounded-full">
                <div className="bg-blue-400" style={{ width: `${spend}%` }} />
                <div className="bg-violet-400" style={{ width: `${save}%` }} />
                <div className="bg-emerald-400" style={{ width: `${earn}%` }} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    bucket: "Spend",
                    pct: spend,
                    color: featured ? "text-blue-300" : "text-blue-500",
                  },
                  {
                    bucket: "Save",
                    pct: save,
                    color: featured ? "text-violet-300" : "text-violet-500",
                  },
                  {
                    bucket: "Earn",
                    pct: earn,
                    color: featured ? "text-emerald-300" : "text-emerald-600",
                  },
                ].map(({ bucket, pct, color }) => (
                  <div key={bucket}>
                    <p className={cn("text-xl font-bold", color)}>{pct}%</p>
                    <p
                      className={cn(
                        "text-xs font-semibold tracking-widest uppercase",
                        featured ? "text-gray-500" : "text-gray-400",
                      )}
                    >
                      {bucket}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/app"
                className={cn(
                  "mt-8 block rounded-full py-3 text-center text-sm font-semibold transition",
                  featured
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-700",
                )}
              >
                Get started →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
