import { Eyebrow } from "@/components/dashboard/ui/eyebrow";
import { SectionCard } from "@/components/dashboard/ui/section-card";
import { cn } from "@/lib/utils";

type Bucket = {
  label: string;
  value: string;
  tone: "blue" | "violet" | "emerald";
};

const toneClasses: Record<Bucket["tone"], string> = {
  blue: "text-blue-500",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
};

type BucketBalancesCardProps = {
  spendBalance: string;
  saveBalance: string;
  earnBalance: string;
};

export function BucketBalancesCard({
  spendBalance,
  saveBalance,
  earnBalance,
}: BucketBalancesCardProps) {
  const buckets: Bucket[] = [
    { label: "Spend", value: spendBalance, tone: "blue" },
    { label: "Save", value: saveBalance, tone: "violet" },
    { label: "Earn", value: earnBalance, tone: "emerald" },
  ];

  return (
    <SectionCard>
      <Eyebrow>Bucket Balances</Eyebrow>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="rounded-2xl bg-gray-50 p-4">
            <Eyebrow>{bucket.label}</Eyebrow>
            <p
              className={cn("mt-3 text-xl font-bold", toneClasses[bucket.tone])}
            >
              {bucket.value}
            </p>
            <p className="text-xs text-gray-400">USDC</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-gray-500">
        Spend stays liquid in wallet. Save is reserved. Earn is routed to the
        approved Kamino venue.
      </p>
    </SectionCard>
  );
}
