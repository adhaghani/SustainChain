/**
 * Server-Side Rate Limiting for Expensive Operations
 * 
 * This module provides Firestore-backed rate limiting for expensive operations
 * such as Bill Analysis (Gemini API) and Report Generation (PDF generation).
 * 
 * Uses a sliding window algorithm with Firestore subcollection tracking:
 * /tenants/{tenantId}/rate_limits/{operation}
 * 
 * For frequent, low-cost operations, use client-side rate limiting instead.
 */

import { db as adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number; // seconds until next request allowed
}

export interface RateLimitRecord {
  operation: string;
  tenantId: string;
  timestamps: Timestamp[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Rate limit operations that are tracked in Firestore.
 * These should only be expensive operations with real monetary cost.
 */
export const RATE_LIMIT_OPERATIONS = {
  BILL_ANALYSIS: 'billAnalysis',
  REPORT_GENERATION: 'reportGeneration',
} as const;

export type RateLimitOperation = typeof RATE_LIMIT_OPERATIONS[keyof typeof RATE_LIMIT_OPERATIONS];

/**
 * Checks if a request should be rate limited using Firestore-backed sliding window.
 * 
 * @param tenantId - The tenant ID making the request
 * @param operation - The operation being performed
 * @param limit - Maximum requests per window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @param bypassRateLimit - If true, bypass rate limiting (for admins)
 * @returns RateLimitResult indicating if request is allowed
 */
export async function checkRateLimit(
  tenantId: string,
  operation: RateLimitOperation,
  limit: number,
  windowMs: number = 60000,
  bypassRateLimit: boolean = false
): Promise<RateLimitResult> {
  // Admin bypass
  if (bypassRateLimit) {
    return {
      allowed: true,
      remaining: limit,
      resetTime: new Date(Date.now() + windowMs),
    };
  }

  const now = Timestamp.now();
  const windowStart = Timestamp.fromMillis(now.toMillis() - windowMs);

  const rateLimitRef = adminDb
    .collection('tenants')
    .doc(tenantId)
    .collection('rate_limits')
    .doc(operation);

  try {
    // Use a transaction to ensure consistency
    const result = await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(rateLimitRef);
      
      let timestamps: Timestamp[] = [];
      
      if (doc.exists) {
        const data = doc.data() as RateLimitRecord;
        timestamps = data.timestamps || [];
      }

      // Filter out timestamps outside the current window
      const validTimestamps = timestamps.filter(ts => ts.toMillis() > windowStart.toMillis());

      // Calculate remaining requests
      const currentCount = validTimestamps.length;
      const remaining = Math.max(0, limit - currentCount);

      // Check if limit exceeded
      if (currentCount >= limit) {
        // Find the oldest timestamp to determine when it will expire
        const oldestTimestamp = validTimestamps[0];
        const resetTime = new Date(oldestTimestamp.toMillis() + windowMs);
        const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);

        return {
          allowed: false,
          remaining: 0,
          resetTime,
          retryAfter,
        };
      }

      // Add current request timestamp
      validTimestamps.push(now);

      // Update or create the rate limit record
      if (doc.exists) {
        transaction.update(rateLimitRef, {
          timestamps: validTimestamps,
          updatedAt: now,
        });
      } else {
        transaction.set(rateLimitRef, {
          operation,
          tenantId,
          timestamps: validTimestamps,
          createdAt: now,
          updatedAt: now,
        });
      }

      // Calculate when the oldest request will expire
      const resetTime = new Date(validTimestamps[0].toMillis() + windowMs);

      return {
        allowed: true,
        remaining: remaining - 1, // Subtract 1 for the current request
        resetTime,
      };
    });

    return result;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request but log it
    // This prevents rate limiting from blocking critical operations during issues
    return {
      allowed: true,
      remaining: limit,
      resetTime: new Date(Date.now() + windowMs),
    };
  }
}

/**
 * Gets the current rate limit status without incrementing the count.
 * Useful for showing users their current usage.
 * 
 * @param tenantId - The tenant ID
 * @param operation - The operation to check
 * @param limit - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 * @returns Current usage information
 */
export async function getRateLimitStatus(
  tenantId: string,
  operation: RateLimitOperation,
  limit: number,
  windowMs: number = 60000
): Promise<{
  current: number;
  limit: number;
  remaining: number;
  resetTime: Date;
}> {
  const now = Timestamp.now();
  const windowStart = Timestamp.fromMillis(now.toMillis() - windowMs);

  const rateLimitRef = adminDb
    .collection('tenants')
    .doc(tenantId)
    .collection('rate_limits')
    .doc(operation);

  try {
    const doc = await rateLimitRef.get();

    if (!doc.exists) {
      return {
        current: 0,
        limit,
        remaining: limit,
        resetTime: new Date(Date.now() + windowMs),
      };
    }

    const data = doc.data() as RateLimitRecord;
    const timestamps = data.timestamps || [];

    // Filter valid timestamps within window
    const validTimestamps = timestamps.filter(ts => ts.toMillis() > windowStart.toMillis());

    const current = validTimestamps.length;
    const remaining = Math.max(0, limit - current);

    // Calculate reset time from oldest timestamp
    const resetTime = validTimestamps.length > 0
      ? new Date(validTimestamps[0].toMillis() + windowMs)
      : new Date(Date.now() + windowMs);

    return {
      current,
      limit,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error('Get rate limit status error:', error);
    return {
      current: 0,
      limit,
      remaining: limit,
      resetTime: new Date(Date.now() + windowMs),
    };
  }
}

/**
 * Clears rate limit data for a tenant and operation.
 * Admin-only function for manual resets.
 * 
 * @param tenantId - The tenant ID
 * @param operation - The operation to clear (optional, clears all if not specified)
 */
export async function clearRateLimit(
  tenantId: string,
  operation?: RateLimitOperation
): Promise<void> {
  const rateLimitsRef = adminDb
    .collection('tenants')
    .doc(tenantId)
    .collection('rate_limits');

  if (operation) {
    // Clear specific operation
    await rateLimitsRef.doc(operation).delete();
  } else {
    // Clear all operations
    const snapshot = await rateLimitsRef.get();
    const batch = adminDb.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

/**
 * Cleanup job to remove old rate limit records.
 * Should be called periodically (e.g., daily via Cloud Scheduler)
 * 
 * @param maxAgeMs - Maximum age of records to keep (default: 24 hours)
 */
export async function cleanupOldRateLimits(maxAgeMs: number = 86400000): Promise<void> {
  const cutoffTime = Timestamp.fromMillis(Date.now() - maxAgeMs);

  try {
    // Query all tenants
    const tenantsSnapshot = await adminDb.collection('tenants').get();

    for (const tenantDoc of tenantsSnapshot.docs) {
      const rateLimitsRef = tenantDoc.ref.collection('rate_limits');
      const oldRecords = await rateLimitsRef
        .where('updatedAt', '<', cutoffTime)
        .get();

      if (oldRecords.empty) continue;

      const batch = adminDb.batch();
      oldRecords.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${oldRecords.size} old rate limit records for tenant ${tenantDoc.id}`);
    }
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
  }
}
