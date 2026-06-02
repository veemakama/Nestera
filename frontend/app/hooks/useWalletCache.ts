"use client";

import { useEffect, useState } from "react";
import { env } from "../lib/env";

interface Balance {
  asset_code: string;
  balance: string;
  asset_type: string;
  asset_issuer?: string;
  usd_value: number;
}

const COINGECKO_IDS: Record<string, string> = {
  XLM: "stellar",
  USDC: "usd-coin",
  AQUA: "aqua",
};

async function fetchPrices(): Promise<Record<string, number>> {
  const ids = Object.values(COINGECKO_IDS).join(",");
  const res = await fetch(`${env.coingeckoApi}/simple/price?ids=${ids}&vs_currencies=usd`);

  if (!res.ok) {
    throw new Error("Failed to fetch prices");
  }

  const data = await res.json();
  const prices: Record<string, number> = {};

  for (const [code, id] of Object.entries(COINGECKO_IDS)) {
    prices[code] = data[id]?.usd ?? (code === "USDC" ? 1 : 0);
  }

  return prices;
}

async function fetchBalances(address: string, horizonUrl: string): Promise<Balance[]> {
  const res = await fetch(`${horizonUrl.replace(/\/$/, "")}/accounts/${address}`);

  if (!res.ok) {
    throw new Error("Failed to fetch wallet balances");
  }

  const account = await res.json();

  return (account.balances ?? []).map((balance: {
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
    balance: string;
  }) => ({
    asset_code: balance.asset_type === "native" ? "XLM" : balance.asset_code ?? "UNKNOWN",
    balance: balance.balance,
    asset_type: balance.asset_type,
    asset_issuer: balance.asset_issuer,
    usd_value: 0,
  }));
}

export function usePrices() {
  const [data, setData] = useState<Record<string, number>>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPrices()
      .then((prices) => {
        if (!cancelled) setData(prices);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error("Failed to fetch prices"));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, isLoading: !data && !error };
}

export function useWalletBalances(
  address: string | null,
  _network: string | null,
  horizonUrl: string,
) {
  const { data: prices } = usePrices();
  const [data, setData] = useState<Balance[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!address) {
      setData([]);
      setDataUpdatedAt(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const rawBalances = await fetchBalances(address, horizonUrl);
        const enriched = rawBalances.map((balance) => {
          const price = prices?.[balance.asset_code] ?? (balance.asset_code === "USDC" ? 1 : 0);
          return {
            ...balance,
            usd_value: parseFloat(balance.balance) * price,
          };
        });

        if (!cancelled) {
          setData(enriched);
          setError(null);
          setDataUpdatedAt(Date.now());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to fetch wallet balances"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, horizonUrl, prices]);

  return { data, isLoading, error, dataUpdatedAt };
}

export function useInvalidateBalances() {
  return () => undefined;
}
