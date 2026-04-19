import type { Metadata } from "next";
import "@solana/wallet-adapter-react-ui/styles.css";

import { SolanaWalletProvider } from "@/components/providers/solana-wallet-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirev",
  description: "Autopilot treasury routing for spend, save, and earn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
