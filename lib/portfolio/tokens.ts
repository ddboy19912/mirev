export type SupportedTokenSymbol = "USDC";

export type TokenDescriptorInput =
  | SupportedTokenSymbol
  | {
      symbol: SupportedTokenSymbol;
    }
  | {
      mint: string;
      symbol?: string;
    };

export type TokenDescriptor = {
  symbol: string;
  mint: string;
  name: string;
  decimals: number;
};

export const TOKEN_REGISTRY: Record<SupportedTokenSymbol, TokenDescriptor> = {
  USDC: {
    symbol: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    decimals: 6,
  },
};

export function resolveTokenDescriptors(tokens: TokenDescriptorInput[]) {
  return tokens.map((token) => {
    if (typeof token === "string") {
      return TOKEN_REGISTRY[token];
    }

    if ("symbol" in token && token.symbol && token.symbol in TOKEN_REGISTRY) {
      const registryToken =
        TOKEN_REGISTRY[token.symbol as SupportedTokenSymbol];

      return {
        ...registryToken,
        ...("mint" in token && token.mint ? { mint: token.mint } : {}),
      };
    }

    if ("mint" in token) {
      return {
        symbol: "symbol" in token && token.symbol ? token.symbol : token.mint,
        mint: token.mint,
        name: "Unknown Token",
        decimals: 0,
      };
    }

    throw new Error("Custom token descriptors must include a mint address.");
  });
}

export function serializeTokenDescriptors(tokens: TokenDescriptorInput[]) {
  return JSON.stringify(tokens);
}
