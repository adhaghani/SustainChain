/**
 * Hook to fetch tenant usage statistics (rate limits)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface TenantUsageData {
  billAnalysis: {
    current: number;
    limit: number;
    remaining: number;
    resetTime: string;
    percentage: number;
  };
  reportGeneration: {
    current: number;
    limit: number;
    remaining: number;
    resetTime: string;
    percentage: number;
  };
  tenantId: string;
}

interface UseTenantUsageReturn {
  data: TenantUsageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch tenant's current rate limit usage
 */
export function useTenantUsage(): UseTenantUsageReturn {
  const { user } = useAuth();
  const [data, setData] = useState<TenantUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const idToken = await user.getIdToken();

      const response = await fetch('/api/tenant/usage', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch tenant usage');
      }

      setData(result.data);
    } catch (err) {
      console.error('Tenant usage fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching usage data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    data,
    loading,
    error,
    refetch: fetchUsage,
  };
}
