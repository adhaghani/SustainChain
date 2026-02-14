/**
 * Tenant Monthly Quota Hook
 * 
 * React hook to fetch and manage tenant's monthly quota usage
 * for bill analysis and report generation operations.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface QuotaData {
  current: number;
  limit: number;
  remaining: number;
  resetTime: string;
  percentUsed: number;
  unlimited: boolean;
}

export interface TenantQuotaData {
  billAnalysis: QuotaData;
  reportGeneration: QuotaData;
  tenantId: string;
}

export interface UseTenantQuotaReturn {
  data: TenantQuotaData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch tenant's monthly quota usage
 * 
 * Automatically fetches quota on mount and when user changes.
 * Returns loading/error states and refetch function.
 */
export function useTenantQuota(): UseTenantQuotaReturn {
  const { user } = useAuth();
  const [data, setData] = useState<TenantQuotaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = useCallback(async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Fetch quota from API
      const response = await fetch('/api/tenant/quota', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch quota');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      setData(result.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tenant quota:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch quota on mount and when user changes
  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuota,
  };
}
