import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: React.ReactNode;
  variant?: "default" | "dark";
  className?: string;
};

export function SectionCard({
  children,
  variant = "default",
  className = "",
}: SectionCardProps) {
  const base =
    variant === "dark"
      ? "rounded-3xl bg-[#0d1117] p-8 text-white"
      : "rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]";
  return <article className={cn(base, className)}>{children}</article>;
}
