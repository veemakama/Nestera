"use client";

import { useEffect, useState } from "react";
import { env } from "../lib/env";

const COINGECKO_IDS: Record<string, string> = {
  XLM: "stellar",
  USDC: "usd-coin",
  AQUA: "aqua",
};

interface PriceData {
  [coingeckoId: string]: { usd: number };
}

async function fetchPrices(): Promise<PriceData> {
  const assetIds = Object.values(COINGECKO_IDS).join(",");
  const res = await fetch(
    `${env.coingeckoApi}/simple/price?ids=${assetIds}&vs_currencies=usd`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch prices");
  }

  return res.json();
}

export function usePrices() {
  const [data, setData] = useState<PriceData>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const prices = await fetchPrices();
        if (!cancelled) {
          setData(prices);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch prices"));
        }
      }
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, error, isLoading: !data && !error };
}

export function getAssetPrice(
  prices: PriceData | undefined,
  assetCode: string,
): number {
  if (!prices) return assetCode === "USDC" ? 1 : 0;
  const coingeckoId = COINGECKO_IDS[assetCode];
  return prices[coingeckoId]?.usd ?? (assetCode === "USDC" ? 1 : 0);
}

export { COINGECKO_IDS };
export type { PriceData };
