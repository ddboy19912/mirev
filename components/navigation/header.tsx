import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Image
          src={"/images/mirev-logo.webp"}
          alt="Mirev Logo"
          width={120}
          height={32}
        />

        <Link
          href="/app"
          className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Launch App →
        </Link>
      </div>
    </header>
  );
};
