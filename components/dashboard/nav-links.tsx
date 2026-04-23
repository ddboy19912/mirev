"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/app", label: "Overview" },
  { href: "/app/earn", label: "Earn" },
  { href: "/app/deposit", label: "Deposit" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition",
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
