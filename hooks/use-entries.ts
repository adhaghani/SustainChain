/**
 * React Hooks for Entries
 */

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import type { EntryDocument } from '@/types/firestore';

interface UseEntriesOptions {
  limitCount?: number;
  utilityType?: string;
  status?: string;
  userId?: string;
}

interface UseEntriesResult {
  entries: EntryDocument[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch entries for current tenant
 */
export function useEntries(options: UseEntriesOptions = {}): UseEntriesResult {
  const { tenantId } = useAuth();
  const [entries, setEntries] = useState<EntryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = async () => {
    if (!tenantId || !db) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query
      const entriesRef = collection(db, 'tenants', tenantId, 'entries');
      let q = query(entriesRef, orderBy('createdAt', 'desc'));

      // Add filters
      if (options.utilityType) {
        q = query(q, where('utilityType', '==', options.utilityType));
      }
      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }
      if (options.userId) {
        q = query(q, where('userId', '==', options.userId));
      }

      // Add limit
      if (options.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);
      const fetchedEntries: EntryDocument[] = [];

      querySnapshot.forEach((doc) => {
        fetchedEntries.push({
          id: doc.id,
          ...doc.data(),
        } as EntryDocument);
      });

      setEntries(fetchedEntries);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, options.utilityType, options.status, options.userId, options.limitCount]);

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
  };
}

/**
 * Hook to get recent entries (last 5)
 */
export function useRecentEntries() {
  return useEntries({ limitCount: 5 });
}
