import { isValidWalletAddress } from "@/lib/auth";
import { getWalletTokenBalances } from "@/lib/portfolio/helius";
import type { TokenDescriptorInput } from "@/lib/portfolio/tokens";

export const dynamic = "force-dynamic";

function parseTokenInputs(rawValue: string | null): TokenDescriptorInput[] {
  if (!rawValue) {
    return [];
  }

  const parsed = JSON.parse(rawValue) as unknown;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed as TokenDescriptorInput[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress")?.trim();
  const rawTokens = searchParams.get("tokens");

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

  const tokens = parseTokenInputs(rawTokens);

  if (tokens.length === 0) {
    return Response.json(
      { error: "At least one token descriptor is required." },
      { status: 400 },
    );
  }

  try {
    const balances = await getWalletTokenBalances({
      walletAddress,
      tokens,
    });

    return Response.json({
      walletAddress,
      balances,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not fetch wallet balances.",
      },
      { status: 502 },
    );
  }
}
