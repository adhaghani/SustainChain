import { useCallback, useEffect, useRef } from 'react';
import { debounce, type DebouncedFunction } from '@/lib/client-rate-limiter';

/**
 * Custom React hook that returns a debounced version of a callback function.
 * 
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependency array (like useCallback)
 * @returns A debounced version of the callback
 * 
 * @example
 * ```tsx
 * const handleSearch = useDebouncedCallback(
 *   (query: string) => {
 *     fetchSearchResults(query);
 *   },
 *   500, // 500ms delay
 *   [fetchSearchResults]
 * );
 * 
 * return <input onChange={(e) => handleSearch(e.target.value)} />;
 * ```
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): DebouncedFunction<T> {
  const debouncedRef = useRef<DebouncedFunction<T> | null>(null);

  // Create memoized callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);

  // Create debounced version when callback or delay changes
  useEffect(() => {
    debouncedRef.current = debounce(memoizedCallback, delay);

    // Cleanup: cancel pending debounced calls
    return () => {
      debouncedRef.current?.cancel();
    };
  }, [memoizedCallback, delay]);

  // Return the debounced function
  // We create a stable reference that forwards to the current debounced function
  const stableDebounced = useRef<DebouncedFunction<T>>(
    Object.assign(
      (...args: Parameters<T>) => {
        debouncedRef.current?.(...args);
      },
      {
        cancel: () => debouncedRef.current?.cancel(),
        flush: () => debouncedRef.current?.flush(),
      }
    ) as DebouncedFunction<T>
  );

  return stableDebounced.current;
}

/**
 * Custom React hook for debouncing a value.
 * The value will only update after it stops changing for the specified delay.
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const debouncedQuery = useDebouncedValue(searchQuery, 500);
 * 
 *   useEffect(() => {
 *     if (debouncedQuery) {
 *       fetchSearchResults(debouncedQuery);
 *     }
 *   }, [debouncedQuery]);
 * 
 *   return <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />;
 * }
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import useState for useDebouncedValue
import { useState } from 'react';
