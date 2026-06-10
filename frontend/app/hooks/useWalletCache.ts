// Stub wallet cache hook for MVP
export function useWalletCache() {
  return {
    getCachedBalance: () => null,
    setCachedBalance: () => {},
    clearCache: () => {},
  };
}

export function useWalletBalances() {
  return {
    data: [],
    isLoading: false,
    error: null,
    dataUpdatedAt: Date.now(),
    refetch: () => Promise.resolve(),
  };
}
