/**
 * Client-Side Rate Limiting Utilities
 * 
 * This module provides debouncing utilities for client-side rate limiting.
 * These are used for frequent, low-cost operations like dashboard refreshes,
 * analytics queries, exports, and search operations.
 * 
 * Note: These do NOT track usage in Firestore. For expensive operations
 * (Bill Analysis, Report Generation), use server-side rate limiting instead.
 */

export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

/**
 * Creates a debounced version of the provided function.
 * The function will only be called after it stops being invoked for `delay` milliseconds.
 * 
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function with cancel() and flush() methods
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
      lastArgs = null;
    }, delay);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      func(...lastArgs);
      timeoutId = null;
      lastArgs = null;
    }
  };

  return debounced;
}

/**
 * Rate limit configurations loaded from environment variables.
 * These provide default limits for per-user client-side operations.
 */
export const CLIENT_RATE_LIMITS = {
  // Dashboard page loads/refreshes (requests per minute)
  DASHBOARD_MIN: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_DASHBOARD_MIN || '30', 10),
  
  // Analytics queries (requests per minute)
  ANALYTICS_MIN: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_ANALYTICS_MIN || '30', 10),
  
  // Data exports (requests per minute)
  EXPORT_MIN: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_EXPORT_MIN || '10', 10),
  
  // Search/filter operations (requests per minute)
  SEARCH_MIN: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_SEARCH_MIN || '60', 10),
  
  // Debounce delay in milliseconds
  DEBOUNCE_MS: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_DEBOUNCE_MS || '500', 10),
};

/**
 * Tracks request counts for client-side rate limiting.
 * Uses a sliding window approach to track requests per minute.
 */
class ClientRateLimitTracker {
  private requests: Map<string, number[]> = new Map();

  /**
   * Checks if a request should be allowed based on the rate limit.
   * 
   * @param key - Unique identifier for the operation (e.g., 'dashboard-refresh')
   * @param limit - Maximum requests per minute
   * @returns true if request is allowed, false if rate limit exceeded
   */
  isAllowed(key: string, limit: number): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute ago

    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];

    // Remove requests outside the current window
    timestamps = timestamps.filter(ts => ts > windowStart);

    // Check if limit exceeded
    if (timestamps.length >= limit) {
      return false;
    }

    // Add current request
    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  /**
   * Gets the number of requests made in the current window.
   * 
   * @param key - Unique identifier for the operation
   * @returns Number of requests in the current window
   */
  getRequestCount(key: string): number {
    const now = Date.now();
    const windowStart = now - 60000;

    let timestamps = this.requests.get(key) || [];
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    this.requests.set(key, timestamps);
    return timestamps.length;
  }

  /**
   * Gets the time until the rate limit resets (oldest request expires).
   * 
   * @param key - Unique identifier for the operation
   * @returns Milliseconds until next available slot, or 0 if available now
   */
  getTimeUntilReset(key: string): number {
    const now = Date.now();
    const windowStart = now - 60000;

    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) {
      return 0;
    }

    const oldestRequest = timestamps[0];
    if (oldestRequest <= windowStart) {
      return 0;
    }

    return oldestRequest - windowStart;
  }

  /**
   * Clears all tracked requests for a specific key.
   * 
   * @param key - Unique identifier for the operation
   */
  clear(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clears all tracked requests.
   */
  clearAll(): void {
    this.requests.clear();
  }
}

// Singleton instance for client-side tracking
export const rateLimitTracker = new ClientRateLimitTracker();

/**
 * Higher-order function that wraps an async function with client-side rate limiting.
 * 
 * @param func - The async function to wrap
 * @param key - Unique identifier for rate limiting
 * @param limit - Maximum requests per minute
 * @returns Wrapped function that enforces rate limiting
 */
export function withClientRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  key: string,
  limit: number
): T {
  return (async (...args: Parameters<T>) => {
    if (!rateLimitTracker.isAllowed(key, limit)) {
      const timeUntilReset = rateLimitTracker.getTimeUntilReset(key);
      const resetTime = new Date(Date.now() + timeUntilReset).toLocaleTimeString();
      
      throw new Error(
        `Rate limit exceeded. You've made ${rateLimitTracker.getRequestCount(key)} requests in the last minute. ` +
        `Please wait ${Math.ceil(timeUntilReset / 1000)} seconds (resets at ${resetTime}).`
      );
    }

    return func(...args);
  }) as T;
}
