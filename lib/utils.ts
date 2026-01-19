import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Firestore Timestamp type
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Convert Firestore timestamp to JavaScript Date
 */
export function firestoreTimestampToDate(timestamp: FirestoreTimestamp): Date {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
}

/**
 * Format Firestore timestamp to a readable string
 * @param timestamp - Firestore timestamp object
 * @param options - Intl.DateTimeFormat options (defaults to date + time)
 */
export function formatFirestoreTimestamp(
  timestamp: FirestoreTimestamp,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = firestoreTimestampToDate(timestamp);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Format Firestore timestamp to relative time (e.g., "2 hours ago")
 */
export function formatFirestoreTimestampRelative(timestamp: FirestoreTimestamp): string {
  const date = firestoreTimestampToDate(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatFirestoreTimestamp(timestamp, { year: 'numeric', month: 'short', day: 'numeric' });
}
