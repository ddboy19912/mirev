import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="px-8 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Image
          src={"/images/mirev-logo.webp"}
          alt="Mirev Logo"
          width={120}
          height={32}
        />

        <p className="text-xs text-gray-400">
          Built on Solana · Powered by Kamino
        </p>
      </div>
    </footer>
  );
};
