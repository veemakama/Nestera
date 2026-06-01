"use client";

import { useQuery } from "@tanstack/react-query";
import { env } from "../lib/env";

const COINGECKO_IDS: Record<string, string> = {
  XLM: "stellar",
  USDC: "usd-coin",
  AQUA: "aqua",
};

const PRICE_CACHE_KEY = ["coingecko-prices"];

interface PriceData {
  [coingeckoId: string]: { usd: number };
}

async function fetchPrices(): Promise<PriceData> {
  const assetIds = Object.values(COINGECKO_IDS).join(",");
  const res = await fetch(
    `${env.coingeckoApi}/simple/price?ids=${assetIds}&vs_currencies=usd`
  );
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

/**
 * Hook to fetch and cache CoinGecko prices.
 * Prices are cached for 5 minutes to reduce unnecessary API calls.
 */
export function usePrices() {
  return useQuery({
    queryKey: PRICE_CACHE_KEY,
    queryFn: fetchPrices,
    // Prices update every 5 minutes
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Get USD price for a given asset code from cached price data.
 */
export function getAssetPrice(
  prices: PriceData | undefined,
  assetCode: string
): number {
  if (!prices) return assetCode === "USDC" ? 1 : 0;
  const coingeckoId = COINGECKO_IDS[assetCode];
  return prices[coingeckoId]?.usd ?? (assetCode === "USDC" ? 1 : 0);
}

export { COINGECKO_IDS };
export type { PriceData };
