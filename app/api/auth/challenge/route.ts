import { headers } from "next/headers";
import {
  buildAuthMessage,
  createNonce,
  getAuthChallengeTtlMs,
  getAuthDomain,
  getAuthStatement,
  isValidWalletAddress,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ChallengeRequest = {
  walletAddress?: string;
  walletType?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ChallengeRequest;
  const walletAddress = body.walletAddress?.trim();
  const walletType = body.walletType?.trim() ?? "phantom";

  if (!walletAddress) {
    return Response.json(
      { error: "walletAddress is required." },
      { status: 400 },
    );
  }

  if (!isValidWalletAddress(walletAddress)) {
    return Response.json(
      { error: "Invalid Solana wallet address." },
      { status: 400 },
    );
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const domain = getAuthDomain(origin);
  const nonce = createNonce();
  const expiresAt = new Date(Date.now() + getAuthChallengeTtlMs());

  const wallet = await prisma.wallet.upsert({
    where: { address: walletAddress },
    update: {
      walletType,
    },
    create: {
      address: walletAddress,
      walletType,
      user: {
        create: {},
      },
    },
  });

  await prisma.authChallenge.upsert({
    where: { walletAddress },
    update: {
      walletId: wallet.id,
      nonce,
      statement: getAuthStatement(),
      domain,
      expiresAt,
    },
    create: {
      walletId: wallet.id,
      walletAddress,
      nonce,
      statement: getAuthStatement(),
      domain,
      expiresAt,
    },
  });

  const message = buildAuthMessage({
    walletAddress,
    nonce,
    domain,
  });

  return Response.json({
    message,
    nonce,
    domain,
    expiresAt: expiresAt.toISOString(),
  });
}
