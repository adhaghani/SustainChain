'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

interface YourPerformance {
  currentEmissions: number;
  previousEmissions: number;
  sectorAverage: number;
  percentile: number;
  rank: number;
  totalCompanies: number;
  sector: string;
  improvement: number;
  belowAverage: number;
}

interface SectorComparisonItem {
  label: string;
  emissions: number;
  rank?: number;
  isYou: boolean;
}

interface RegionalStats {
  region: string;
  avgEmissions: number;
  companyCount: number;
}

interface EmissionTrend {
  month: string;
  tenantEmissions: number;
  sectorAverage: number;
}

interface TopPerformer {
  tenantId: string;
  tenantName: string;
  sector: string;
  currentEmissions: number;
  previousEmissions: number;
  improvement: number;
  isYou: boolean;
}

export interface AnalyticsData {
  yourPerformance: YourPerformance;
  sectorComparison: SectorComparisonItem[];
  regionalComparison: RegionalStats[];
  emissionTrends: EmissionTrend[];
  topPerformers: TopPerformer[];
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch analytics and benchmarking data
 */
export function useAnalytics(period: 'monthly' | 'quarterly' | 'yearly' = 'monthly'): UseAnalyticsReturn {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const idToken = await user.getIdToken();

      const response = await fetch(`/api/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }

      setData(result.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
