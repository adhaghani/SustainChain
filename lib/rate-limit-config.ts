/**
 * Rate Limit Configuration Loader
 * 
 * Fetches rate limit configuration from Firestore (/system_config/api_limits)
 * with in-memory caching to minimize database reads.
 * 
 * Configuration is cached for 5 minutes to balance freshness with performance.
 */

import { db as adminDb } from './firebase-admin';
import type { RateLimitOperation } from './rate-limiter';

export interface RateLimitConfig {
  billAnalysis: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  reportGeneration: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  lastUpdated?: Date;
}

export interface QuotaConfig {
  trial: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  standard: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  premium: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
  enterprise: {
    maxUsers: number;
    maxBillsPerMonth: number;
    maxReportsPerMonth: number;
  };
}

/**
 * Default rate limits if Firestore config is not available.
 * These match the values from FIREBASE_SCHEMA.md
 */
const DEFAULT_RATE_LIMITS: RateLimitConfig = {
  billAnalysis: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
  },
  reportGeneration: {
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 200,
  },
};

/**
 * Default quotas by subscription tier.
 * These match the values from FIREBASE_SCHEMA.md
 */
const DEFAULT_QUOTAS: QuotaConfig = {
  trial: {
    maxUsers: 1,
    maxBillsPerMonth: 2,
    maxReportsPerMonth: 0,
  },
  standard: {
    maxUsers: 10,
    maxBillsPerMonth: 50,
    maxReportsPerMonth: 50,
  },
  premium: {
    maxUsers: 50,
    maxBillsPerMonth: 2000,
    maxReportsPerMonth: 200,
  },
  enterprise: {
    maxUsers: -1, // unlimited
    maxBillsPerMonth: -1, // unlimited
    maxReportsPerMonth: -1, // unlimited
  },
};

// In-memory cache
let cachedConfig: RateLimitConfig | null = null;
let cachedQuotas: QuotaConfig | null = null;
let cacheTimestamp: number = 0;

// Cache TTL: 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Checks if the cache is still valid.
 */
function isCacheValid(): boolean {
  return cachedConfig !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}

/**
 * Fetches rate limit configuration from Firestore with caching.
 * 
 * @param forceRefresh - If true, bypass cache and fetch fresh data
 * @returns Rate limit configuration
 */
export async function getRateLimitConfig(forceRefresh: boolean = false): Promise<RateLimitConfig> {
  // Return cached config if valid and not forcing refresh
  if (!forceRefresh && isCacheValid() && cachedConfig) {
    return cachedConfig;
  }

  try {
    const configRef = adminDb.collection('system_config').doc('api_limits');
    const configDoc = await configRef.get();

    if (!configDoc.exists) {
      console.warn('Rate limit config not found in Firestore, using defaults');
      cachedConfig = DEFAULT_RATE_LIMITS;
      cacheTimestamp = Date.now();
      return DEFAULT_RATE_LIMITS;
    }

    const data = configDoc.data();
    
    const config: RateLimitConfig = {
      billAnalysis: {
        requestsPerMinute: data?.rateLimits?.billAnalysis?.requestsPerMinute ?? DEFAULT_RATE_LIMITS.billAnalysis.requestsPerMinute,
        requestsPerHour: data?.rateLimits?.billAnalysis?.requestsPerHour ?? DEFAULT_RATE_LIMITS.billAnalysis.requestsPerHour,
        requestsPerDay: data?.rateLimits?.billAnalysis?.requestsPerDay ?? DEFAULT_RATE_LIMITS.billAnalysis.requestsPerDay,
      },
      reportGeneration: {
        requestsPerMinute: data?.rateLimits?.reportGeneration?.requestsPerMinute ?? DEFAULT_RATE_LIMITS.reportGeneration.requestsPerMinute,
        requestsPerHour: data?.rateLimits?.reportGeneration?.requestsPerHour ?? DEFAULT_RATE_LIMITS.reportGeneration.requestsPerHour,
        requestsPerDay: data?.rateLimits?.reportGeneration?.requestsPerDay ?? DEFAULT_RATE_LIMITS.reportGeneration.requestsPerDay,
      },
      lastUpdated: data?.updatedAt?.toDate(),
    };

    // Update cache
    cachedConfig = config;
    cacheTimestamp = Date.now();

    return config;
  } catch (error) {
    console.error('Error fetching rate limit config:', error);
    
    // Return cached config if available, otherwise defaults
    if (cachedConfig) {
      console.warn('Using cached rate limit config due to fetch error');
      return cachedConfig;
    }

    console.warn('Using default rate limit config due to fetch error');
    return DEFAULT_RATE_LIMITS;
  }
}

/**
 * Fetches quota configuration from Firestore with caching.
 * 
 * @param forceRefresh - If true, bypass cache and fetch fresh data
 * @returns Quota configuration by tier
 */
export async function getQuotaConfig(forceRefresh: boolean = false): Promise<QuotaConfig> {
  // Return cached quotas if valid and not forcing refresh
  if (!forceRefresh && isCacheValid() && cachedQuotas) {
    return cachedQuotas;
  }

  try {
    const configRef = adminDb.collection('system_config').doc('api_limits');
    const configDoc = await configRef.get();

    if (!configDoc.exists) {
      console.warn('Quota config not found in Firestore, using defaults');
      cachedQuotas = DEFAULT_QUOTAS;
      return DEFAULT_QUOTAS;
    }

    const data = configDoc.data();
    const quotasData = data?.quotas || {};

    const config: QuotaConfig = {
      trial: {
        maxUsers: quotasData.trial?.maxUsers ?? DEFAULT_QUOTAS.trial.maxUsers,
        maxBillsPerMonth: quotasData.trial?.maxBillsPerMonth ?? DEFAULT_QUOTAS.trial.maxBillsPerMonth,
        maxReportsPerMonth: quotasData.trial?.maxReportsPerMonth ?? DEFAULT_QUOTAS.trial.maxReportsPerMonth,
      },
      standard: {
        maxUsers: quotasData.standard?.maxUsers ?? DEFAULT_QUOTAS.standard.maxUsers,
        maxBillsPerMonth: quotasData.standard?.maxBillsPerMonth ?? DEFAULT_QUOTAS.standard.maxBillsPerMonth,
        maxReportsPerMonth: quotasData.standard?.maxReportsPerMonth ?? DEFAULT_QUOTAS.standard.maxReportsPerMonth,
      },
      premium: {
        maxUsers: quotasData.premium?.maxUsers ?? DEFAULT_QUOTAS.premium.maxUsers,
        maxBillsPerMonth: quotasData.premium?.maxBillsPerMonth ?? DEFAULT_QUOTAS.premium.maxBillsPerMonth,
        maxReportsPerMonth: quotasData.premium?.maxReportsPerMonth ?? DEFAULT_QUOTAS.premium.maxReportsPerMonth,
      },
      enterprise: {
        maxUsers: quotasData.enterprise?.maxUsers ?? DEFAULT_QUOTAS.enterprise.maxUsers,
        maxBillsPerMonth: quotasData.enterprise?.maxBillsPerMonth ?? DEFAULT_QUOTAS.enterprise.maxBillsPerMonth,
        maxReportsPerMonth: quotasData.enterprise?.maxReportsPerMonth ?? DEFAULT_QUOTAS.enterprise.maxReportsPerMonth,
      },
    };

    // Update cache
    cachedQuotas = config;

    return config;
  } catch (error) {
    console.error('Error fetching quota config:', error);
    
    // Return cached quotas if available, otherwise defaults
    if (cachedQuotas) {
      console.warn('Using cached quota config due to fetch error');
      return cachedQuotas;
    }

    console.warn('Using default quota config due to fetch error');
    return DEFAULT_QUOTAS;
  }
}

/**
 * Gets the rate limit for a specific operation and time window.
 * 
 * @param operation - The operation to get limits for
 * @param window - Time window ('minute', 'hour', or 'day')
 * @returns The limit value
 */
export async function getRateLimitForOperation(
  operation: RateLimitOperation,
  window: 'minute' | 'hour' | 'day' = 'minute'
): Promise<number> {
  const config = await getRateLimitConfig();
  
  const limits = config[operation];
  
  switch (window) {
    case 'minute':
      return limits.requestsPerMinute;
    case 'hour':
      return limits.requestsPerHour;
    case 'day':
      return limits.requestsPerDay;
    default:
      return limits.requestsPerMinute;
  }
}

/**
 * Invalidates the cache, forcing the next fetch to retrieve fresh data.
 * Call this after updating rate limit config in Firestore.
 */
export function invalidateCache(): void {
  cachedConfig = null;
  cachedQuotas = null;
  cacheTimestamp = 0;
}

/**
 * Gets the current cache status (for debugging/monitoring).
 */
export function getCacheStatus(): {
  isCached: boolean;
  age: number;
  expiresIn: number;
} {
  const age = cachedConfig ? Date.now() - cacheTimestamp : 0;
  const expiresIn = cachedConfig ? Math.max(0, CACHE_TTL_MS - age) : 0;

  return {
    isCached: isCacheValid(),
    age,
    expiresIn,
  };
}
