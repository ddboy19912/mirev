import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

type StatCardProps = {
  label: string;
  value: string;
  suffix?: string;
  tone?: "default" | "emerald" | "violet" | "blue";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-gray-900",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  blue: "text-blue-500",
};

export function StatCard({
  label,
  value,
  suffix,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <Eyebrow>{label}</Eyebrow>
      <p
        className={cn(
          "mt-3 text-3xl leading-none font-bold tracking-tight",
          toneClasses[tone],
        )}
      >
        {value}
      </p>
      {suffix ? (
        <p className="mt-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {suffix}
        </p>
      ) : null}
    </div>
  );
}
