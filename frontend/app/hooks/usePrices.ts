// Stub price hook for MVP
export function usePrices() {
    return {
        prices: {},
        loading: false,
        error: null,
    };
}

export function getAssetPrice(asset: string): number {
    // Stub prices
    const prices: Record<string, number> = {
        "USDC": 1.00,
        "XLM": 0.12,
    };
    return prices[asset] || 0;
}
