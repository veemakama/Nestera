// Stub monitoring utilities for MVP
// Can be replaced with real monitoring later

export function captureError(error: Error | unknown, context?: Record<string, any>) {
    console.error("[Monitoring] Error:", error, context);
}

export function captureWalletError(error: Error | unknown, context?: Record<string, any>) {
    console.error("[Wallet Error]:", error, context);
}

export function captureApiError(error: Error | unknown, context?: Record<string, any>) {
    console.error("[API Error]:", error, context);
}

export function addBreadcrumb(message: string, data?: Record<string, any>) {
    console.log("[Breadcrumb]:", message, data);
}
