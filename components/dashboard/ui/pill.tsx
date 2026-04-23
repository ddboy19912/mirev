import { cn } from "@/lib/utils";

type PillTone = "green" | "amber" | "slate" | "blue";

type PillProps = {
  label: string;
  tone?: PillTone;
};

const tones: Record<PillTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  slate: "bg-gray-100 text-gray-600 ring-gray-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
};

export function Pill({ label, tone = "slate" }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-widest uppercase ring-1",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
