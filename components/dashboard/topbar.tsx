import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/dashboard/nav-links";
import { WalletButton } from "@/components/dashboard/wallet-button";
import type { SessionData } from "@/lib/hooks/use-session";

type TopbarProps = {
  initialSession: SessionData | null;
};

export function Topbar({ initialSession }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-8 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={"/images/mirev-logo.webp"}
              alt="Mirev Logo"
              width={120}
              height={32}
            />
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <WalletButton initialSession={initialSession} />
        </div>
      </div>
    </header>
  );
}
