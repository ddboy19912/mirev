import {
  buildAuthMessage,
  createSessionToken,
  getAuthSessionTtlMs,
  hashSessionToken,
  isValidWalletAddress,
  setSessionCookie,
  verifySignature,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type VerifyRequest = {
  walletAddress?: string;
  signature?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyRequest;
  const walletAddress = body.walletAddress?.trim();
  const signature = body.signature?.trim();

  if (!walletAddress || !signature) {
    return Response.json(
      { error: "walletAddress and signature are required." },
      { status: 400 },
    );
  }

  if (!isValidWalletAddress(walletAddress)) {
    return Response.json(
      { error: "Invalid Solana wallet address." },
      { status: 400 },
    );
  }

  const challenge = await prisma.authChallenge.findUnique({
    where: { walletAddress },
    include: {
      wallet: true,
    },
  });

  if (!challenge || challenge.expiresAt <= new Date()) {
    return Response.json(
      {
        error:
          "Challenge missing or expired. Request a new signature challenge.",
      },
      { status: 400 },
    );
  }

  const message = buildAuthMessage({
    walletAddress,
    nonce: challenge.nonce,
    domain: challenge.domain,
  });

  let isValid = false;

  try {
    isValid = verifySignature({
      walletAddress,
      message,
      signature,
    });
  } catch {
    return Response.json(
      { error: "Invalid wallet signature payload." },
      { status: 400 },
    );
  }

  if (!isValid) {
    return Response.json(
      { error: "Signature verification failed." },
      { status: 401 },
    );
  }

  const sessionToken = createSessionToken();
  const expiresAt = new Date(Date.now() + getAuthSessionTtlMs());

  await prisma.authChallenge.delete({
    where: { id: challenge.id },
  });

  const session = await prisma.authSession.create({
    data: {
      userId: challenge.wallet.userId,
      walletId: challenge.wallet.id,
      tokenHash: hashSessionToken(sessionToken),
      expiresAt,
    },
  });

  await setSessionCookie(sessionToken, expiresAt);

  return Response.json({
    sessionId: session.id,
    walletAddress,
    userId: challenge.wallet.userId,
    expiresAt: expiresAt.toISOString(),
  });
}
