/**
 * React Hooks for Audit Logs
 */

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import type { AuditLogDocument } from '@/types/firestore';

interface UseAuditLogsOptions {
  limitCount?: number;
  action?: string;
  resource?: string;
  userId?: string;
  status?: string;
  severity?: string;
}

interface UseAuditLogsResult {
  logs: AuditLogDocument[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch audit logs for current tenant
 */
export function useAuditLogs(options: UseAuditLogsOptions = {}): UseAuditLogsResult {
  const { tenantId } = useAuth();
  const [logs, setLogs] = useState<AuditLogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = async () => {
    if (!tenantId || !db) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query
      const logsRef = collection(db, 'tenants', tenantId, 'audit_logs');
      let q = query(logsRef, orderBy('timestamp', 'desc'));

      // Add filters
      if (options.action) {
        q = query(q, where('action', '==', options.action));
      }
      if (options.resource) {
        q = query(q, where('resource', '==', options.resource));
      }
      if (options.userId) {
        q = query(q, where('userId', '==', options.userId));
      }
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }
      if (options.severity) {
        q = query(q, where('severity', '==', options.severity));
      }

      // Add limit
      if (options.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);
      const fetchedLogs: AuditLogDocument[] = [];

      querySnapshot.forEach((doc) => {
        fetchedLogs.push({
          id: doc.id,
          ...doc.data(),
        } as AuditLogDocument);
      });

      setLogs(fetchedLogs);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, options.action, options.resource, options.userId, options.status, options.severity, options.limitCount]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}

/**
 * Hook to get audit log statistics
 */
export function useAuditLogStats() {
  const { logs, loading } = useAuditLogs({ limitCount: 100 });

  const stats = {
    totalLogs: logs.length,
    successfulActions: logs.filter((log) => log.status === 'success').length,
    failedActions: logs.filter((log) => log.status === 'failure').length,
    criticalChanges: logs.filter(
      (log) => log.severity === 'warning' || log.severity === 'error' || log.severity === 'critical'
    ).length,
  };

  return { stats, loading };
}

/**
 * Helper function to format audit log timestamps
 */
export function formatAuditLogTimestamp(timestamp: { toDate?: () => Date } | Date | null | undefined): string {
  if (!timestamp) return 'N/A';
  
  // Handle both Firebase Admin and Client SDK Timestamp types
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  
  // Fallback for Date objects
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  
  return 'Invalid date';
}
