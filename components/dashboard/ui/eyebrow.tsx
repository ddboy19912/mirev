import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  tone?: "light" | "dark";
};

export function Eyebrow({ children, tone = "light" }: EyebrowProps) {
  const color = tone === "dark" ? "text-gray-500" : "text-gray-400";
  return (
    <p className={cn("text-xs font-semibold tracking-widest uppercase", color)}>
      {children}
    </p>
  );
}
