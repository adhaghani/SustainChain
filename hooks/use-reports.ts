/**
 * React Hook for Reports
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { ReportDocument, ReportStatus, ReportType } from '@/types/firestore';

// Serialized version of ReportDocument (as returned by API)
export type SerializedReportDocument = Omit<ReportDocument, 'createdAt' | 'updatedAt' | 'periodStart' | 'periodEnd' | 'generationStartedAt' | 'generationCompletedAt' | 'lastDownloadedAt' | 'expiresAt'> & {
  createdAt: string;
  updatedAt: string;
  periodStart: string;
  periodEnd: string;
  generationStartedAt?: string;
  generationCompletedAt?: string;
  lastDownloadedAt?: string;
  expiresAt?: string;
};

interface UseReportsOptions {
  limitCount?: number;
  status?: ReportStatus;
  reportType?: ReportType;
}

interface UseReportsResult {
  reports: SerializedReportDocument[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch reports for current tenant
 */
export function useReports(options: UseReportsOptions = {}): UseReportsResult {
  const { tenantId, user } = useAuth();
  const [reports, setReports] = useState<SerializedReportDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = useCallback(async () => {
    if (!tenantId || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get auth token
      const token = await user.getIdToken();

      // Build query parameters
      const params = new URLSearchParams();
      if (options.limitCount) {
        params.append('limit', options.limitCount.toString());
      }
      if (options.status) {
        params.append('status', options.status);
      }
      if (options.reportType) {
        params.append('reportType', options.reportType);
      }

      // Fetch reports from API
      const response = await fetch(`/api/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [tenantId, user, options.limitCount, options.status, options.reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
  };
}

/**
 * Hook to get recent reports (last 10)
 */
export function useRecentReports() {
  return useReports({ limitCount: 10 });
}

/**
 * Hook to get completed reports only
 */
export function useCompletedReports(limitCount = 20) {
  return useReports({ status: 'completed', limitCount });
}
