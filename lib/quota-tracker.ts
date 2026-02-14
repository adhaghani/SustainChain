/**
 * Monthly Quota Tracker for Expensive Operations
 * 
 * This module provides Firestore-backed monthly quota tracking for operations
 * with monthly limits based on subscription tiers:
 * - Bill Analysis (Gemini API)
 * - Report Generation (PDF generation)
 * 
 * Quotas reset on the 1st of each month at 00:00 UTC.
 * 
 * Storage: /tenants/{tenantId}/monthlyUsage subcollection
 */

import { db as adminDb } from './firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getQuotaConfig, type QuotaConfig } from './rate-limit-config';
import type { SubscriptionTier } from '@/types/firestore';

export interface QuotaResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  resetTime: Date;
  percentUsed: number;
}

export interface MonthlyUsageData {
  billAnalysisCount: number;
  reportGenerationCount: number;
  periodStart: Timestamp;
  periodEnd: Timestamp;
  lastReset: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Operations that are tracked with monthly quotas
 */
export const QUOTA_OPERATIONS = {
  BILL_ANALYSIS: 'billAnalysis',
  REPORT_GENERATION: 'reportGeneration',
} as const;

export type QuotaOperation = typeof QUOTA_OPERATIONS[keyof typeof QUOTA_OPERATIONS];

/**
 * Get the start and end timestamps for the current month
 */
function getCurrentMonthBounds(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return { start, end };
}

/**
 * Get the quota limit for a specific operation based on subscription tier
 */
function getQuotaLimit(
  quotaConfig: QuotaConfig,
  tier: SubscriptionTier,
  operation: QuotaOperation
): number {
  const tierConfig = quotaConfig[tier];
  
  if (operation === QUOTA_OPERATIONS.BILL_ANALYSIS) {
    return tierConfig.maxBillsPerMonth;
  } else if (operation === QUOTA_OPERATIONS.REPORT_GENERATION) {
    return tierConfig.maxReportsPerMonth;
  }
  
  return 0;
}

/**
 * Initialize or reset monthly usage if we're in a new month
 */
async function ensureCurrentMonth(
  tenantRef: FirebaseFirestore.DocumentReference
): Promise<MonthlyUsageData> {
  const { start, end } = getCurrentMonthBounds();
  const now = Timestamp.now();
  
  const result = await adminDb.runTransaction(async (transaction) => {
    const tenantDoc = await transaction.get(tenantRef);
    
    if (!tenantDoc.exists) {
      throw new Error('Tenant not found');
    }
    
    const tenantData = tenantDoc.data();
    const currentUsage = tenantData?.monthlyUsage as MonthlyUsageData | undefined;
    
    // Check if we need to reset (new month or no usage data)
    const needsReset = !currentUsage || 
                      !currentUsage.periodStart || 
                      currentUsage.periodStart.toDate() < start;
    
    if (needsReset) {
      const newUsage: MonthlyUsageData = {
        billAnalysisCount: 0,
        reportGenerationCount: 0,
        periodStart: Timestamp.fromDate(start),
        periodEnd: Timestamp.fromDate(end),
        lastReset: now,
        updatedAt: now,
      };
      
      transaction.update(tenantRef, {
        monthlyUsage: newUsage,
      });
      
      return newUsage;
    }
    
    return currentUsage;
  });
  
  return result;
}

/**
 * Check if a quota allows the request and increment if allowed
 * 
 * @param tenantId - The tenant ID making the request
 * @param operation - The operation being performed
 * @param bypassQuota - If true, bypass quota checking (for admins or unlimited tiers)
 * @returns QuotaResult indicating if request is allowed
 */
export async function checkQuota(
  tenantId: string,
  operation: QuotaOperation,
  bypassQuota: boolean = false
): Promise<QuotaResult> {
  const tenantRef = adminDb.collection('tenants').doc(tenantId);
  
  // Ensure we have current month's data
  await ensureCurrentMonth(tenantRef);
  
  // Get tenant data with subscription tier
  const tenantDoc = await tenantRef.get();
  
  if (!tenantDoc.exists) {
    throw new Error('Tenant not found');
  }
  
  const tenantData = tenantDoc.data();
  const tier = tenantData?.subscriptionTier as SubscriptionTier || 'trial';
  const usage = tenantData?.monthlyUsage as MonthlyUsageData;
  
  if (!usage) {
    throw new Error('Monthly usage data not initialized');
  }
  
  // Get quota configuration
  const quotaConfig = await getQuotaConfig();
  const limit = getQuotaLimit(quotaConfig, tier, operation);
  
  // Get current count for the operation
  const currentCount = operation === QUOTA_OPERATIONS.BILL_ANALYSIS
    ? usage.billAnalysisCount
    : usage.reportGenerationCount;
  
  // Enterprise tier has unlimited (-1)
  const isUnlimited = limit === -1;
  
  // Increment the counter for tracking (even for admins and unlimited)
  const fieldName = operation === QUOTA_OPERATIONS.BILL_ANALYSIS
    ? 'monthlyUsage.billAnalysisCount'
    : 'monthlyUsage.reportGenerationCount';
  
  await tenantRef.update({
    [fieldName]: FieldValue.increment(1),
    'monthlyUsage.updatedAt': Timestamp.now(),
  });
  
  // Admin bypass or unlimited tier - always allow but track usage
  if (bypassQuota || isUnlimited) {
    return {
      allowed: true,
      current: currentCount + 1,
      limit: -1,
      remaining: -1,
      resetTime: usage.periodEnd.toDate(),
      percentUsed: 0,
    };
  }
  
  const remaining = Math.max(0, limit - currentCount);
  const percentUsed = limit > 0 ? ((currentCount + 1) / limit) * 100 : 0;
  
  // Check if quota would be exceeded (after increment)
  if (currentCount >= limit) {
    // Already exceeded - this request pushed over the limit
    return {
      allowed: false,
      current: currentCount + 1,
      limit,
      remaining: 0,
      resetTime: usage.periodEnd.toDate(),
      percentUsed: 100,
    };
  }
  
  return {
    allowed: true,
    current: currentCount + 1,
    limit,
    remaining: remaining - 1,
    resetTime: usage.periodEnd.toDate(),
    percentUsed,
  };
}

/**
 * Get current quota status without incrementing
 * 
 * @param tenantId - The tenant ID
 * @param operation - The operation to check
 * @returns Current quota usage information
 */
export async function getQuotaStatus(
  tenantId: string,
  operation: QuotaOperation
): Promise<QuotaResult> {
  const tenantRef = adminDb.collection('tenants').doc(tenantId);
  
  // Ensure we have current month's data
  await ensureCurrentMonth(tenantRef);
  
  const tenantDoc = await tenantRef.get();
  
  if (!tenantDoc.exists) {
    throw new Error('Tenant not found');
  }
  
  const tenantData = tenantDoc.data();
  const tier = tenantData?.subscriptionTier as SubscriptionTier || 'trial';
  const usage = tenantData?.monthlyUsage as MonthlyUsageData;
  
  if (!usage) {
    throw new Error('Monthly usage data not initialized');
  }
  
  // Get quota configuration
  const quotaConfig = await getQuotaConfig();
  const limit = getQuotaLimit(quotaConfig, tier, operation);
  
  const currentCount = operation === QUOTA_OPERATIONS.BILL_ANALYSIS
    ? usage.billAnalysisCount
    : usage.reportGenerationCount;
  
  // Enterprise tier has unlimited (-1)
  if (limit === -1) {
    return {
      allowed: true,
      current: currentCount,
      limit: -1,
      remaining: -1,
      resetTime: usage.periodEnd.toDate(),
      percentUsed: 0,
    };
  }
  
  const remaining = Math.max(0, limit - currentCount);
  const percentUsed = limit > 0 ? (currentCount / limit) * 100 : 0;
  
  return {
    allowed: currentCount < limit,
    current: currentCount,
    limit,
    remaining,
    resetTime: usage.periodEnd.toDate(),
    percentUsed,
  };
}

/**
 * Reset quota for a specific tenant (admin function)
 */
export async function resetQuota(tenantId: string): Promise<void> {
  const { start, end } = getCurrentMonthBounds();
  const now = Timestamp.now();
  
  const tenantRef = adminDb.collection('tenants').doc(tenantId);
  
  const newUsage: MonthlyUsageData = {
    billAnalysisCount: 0,
    reportGenerationCount: 0,
    periodStart: Timestamp.fromDate(start),
    periodEnd: Timestamp.fromDate(end),
    lastReset: now,
    updatedAt: now,
  };
  
  await tenantRef.update({
    monthlyUsage: newUsage,
  });
}

/**
 * Initialize monthly usage for a new tenant
 */
export async function initializeQuota(tenantId: string): Promise<void> {
  const tenantRef = adminDb.collection('tenants').doc(tenantId);
  await ensureCurrentMonth(tenantRef);
}
