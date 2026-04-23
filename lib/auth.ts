import { createHash, randomBytes } from "node:crypto";

import bs58 from "bs58";
import { cookies } from "next/headers";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "mirev_session";
const AUTH_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const AUTH_CHALLENGE_TTL_MS = 1000 * 60 * 10;
const AUTH_STATEMENT =
  "Sign this message with Phantom to authenticate with Mirev and start your treasury session.";

export type AuthenticatedSession = {
  sessionId: string;
  userId: string;
  walletAddress: string;
  expiresAt: string;
};

export function createNonce() {
  return randomBytes(16).toString("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAuthDomain(origin: string | null) {
  if (!origin) {
    return "localhost:3000";
  }

  try {
    return new URL(origin).host;
  } catch {
    return origin;
  }
}

export function buildAuthMessage({
  walletAddress,
  nonce,
  domain,
}: {
  walletAddress: string;
  nonce: string;
  domain: string;
}) {
  return [
    `Mirev wants you to sign in with your Solana account:`,
    walletAddress,
    "",
    AUTH_STATEMENT,
    "",
    `Domain: ${domain}`,
    `Nonce: ${nonce}`,
  ].join("\n");
}

export function verifySignature({
  walletAddress,
  message,
  signature,
}: {
  walletAddress: string;
  message: string;
  signature: string;
}) {
  const encodedMessage = new TextEncoder().encode(message);
  const publicKeyBytes = new PublicKey(walletAddress).toBytes();
  const signatureBytes = bs58.decode(signature);

  return nacl.sign.detached.verify(
    encodedMessage,
    signatureBytes,
    publicKeyBytes,
  );
}

export function isValidWalletAddress(walletAddress: string) {
  try {
    new PublicKey(walletAddress);
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentSession(): Promise<AuthenticatedSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const tokenHash = hashSessionToken(sessionToken);

  const session = await prisma.authSession.findUnique({
    where: { tokenHash },
    include: {
      wallet: true,
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  await prisma.authSession.update({
    where: { id: session.id },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return {
    sessionId: session.id,
    userId: session.userId,
    walletAddress: session.wallet.address,
    expiresAt: session.expiresAt.toISOString(),
  };
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashSessionToken(sessionToken) },
    });
  }

  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function getAuthSessionTtlMs() {
  return AUTH_SESSION_TTL_MS;
}

export function getAuthChallengeTtlMs() {
  return AUTH_CHALLENGE_TTL_MS;
}

export function getAuthStatement() {
  return AUTH_STATEMENT;
}
