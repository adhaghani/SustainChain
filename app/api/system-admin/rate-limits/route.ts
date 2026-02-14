/**
 * System Admin Rate Limits API
 * 
 * SuperAdmin-only endpoints for managing rate limits stored in /system_config/api_limits
 * 
 * GET    - Retrieve current rate limit configuration
 * PATCH  - Update rate limit configuration
 * POST   - Reset rate limits for a specific tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db as adminDb } from '@/lib/firebase-admin';
import { getRateLimitConfig, getQuotaConfig, invalidateCache } from '@/lib/rate-limit-config';
import { clearRateLimit } from '@/lib/rate-limiter';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Verify SuperAdmin role from token
 */
async function verifySuperAdmin(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (decodedToken.role !== 'superadmin') {
      return null;
    }

    return decodedToken.uid;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * GET /api/system-admin/rate-limits
 * 
 * Retrieve current rate limit configuration
 */
export async function GET(request: NextRequest) {
  // Verify SuperAdmin
  const superAdminId = await verifySuperAdmin(request);
  
  if (!superAdminId) {
    return NextResponse.json(
      { error: 'Unauthorized. SuperAdmin access required.' },
      { status: 403 }
    );
  }

  try {
    const rateLimits = await getRateLimitConfig(true); // Force refresh
    const quotas = await getQuotaConfig(true);

    return NextResponse.json({
      success: true,
      data: {
        rateLimits,
        quotas,
      },
    });
  } catch (error) {
    console.error('Error fetching rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rate limit configuration' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/system-admin/rate-limits
 * 
 * Update rate limit configuration
 * 
 * Body:
 * {
 *   rateLimits?: {
 *     billAnalysis?: { requestsPerMinute, requestsPerHour, requestsPerDay },
 *     reportGeneration?: { requestsPerMinute, requestsPerHour, requestsPerDay }
 *   },
 *   quotas?: {
 *     trial?: { maxUsers, maxBillsPerMonth, maxReportsPerMonth },
 *     standard?: { ... },
 *     premium?: { ... },
 *     enterprise?: { ... }
 *   }
 * }
 */
export async function PATCH(request: NextRequest) {
  // Verify SuperAdmin
  const superAdminId = await verifySuperAdmin(request);
  
  if (!superAdminId) {
    return NextResponse.json(
      { error: 'Unauthorized. SuperAdmin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { rateLimits, quotas } = body;

    if (!rateLimits && !quotas) {
      return NextResponse.json(
        { error: 'No updates provided. Include rateLimits or quotas in request body.' },
        { status: 400 }
      );
    }

    const configRef = adminDb.collection('system_config').doc('api_limits');
    
    // Fetch current config
    const configDoc = await configRef.get();
    const currentData = configDoc.exists ? configDoc.data() : {};

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: superAdminId,
    };

    // Update rate limits if provided
    if (rateLimits) {
      updateData.rateLimits = {
        ...currentData?.rateLimits,
        ...rateLimits,
      };

      // Validate rate limit values
      const rateLimitsToValidate = updateData.rateLimits as Record<string, Record<string, number>>;
      for (const [operation, limits] of Object.entries(rateLimitsToValidate)) {
        const typedLimits = limits;
        if (typedLimits.requestsPerMinute && typedLimits.requestsPerMinute < 1) {
          return NextResponse.json(
            { error: `Invalid requestsPerMinute for ${operation}: must be >= 1` },
            { status: 400 }
          );
        }
        if (typedLimits.requestsPerHour && typedLimits.requestsPerHour < 1) {
          return NextResponse.json(
            { error: `Invalid requestsPerHour for ${operation}: must be >= 1` },
            { status: 400 }
          );
        }
        if (typedLimits.requestsPerDay && typedLimits.requestsPerDay < 1) {
          return NextResponse.json(
            { error: `Invalid requestsPerDay for ${operation}: must be >= 1` },
            { status: 400 }
          );
        }
      }
    }

    // Update quotas if provided
    if (quotas) {
      updateData.quotas = {
        ...currentData?.quotas,
        ...quotas,
      };

      // Validate quota values
      const quotasToValidate = updateData.quotas as Record<string, Record<string, number>>;
      for (const [tier, tierQuotas] of Object.entries(quotasToValidate)) {
        const typedQuotas = tierQuotas;
        if (typedQuotas.maxUsers !== undefined && typedQuotas.maxUsers < -1) {
          return NextResponse.json(
            { error: `Invalid maxUsers for ${tier}: must be >= -1 (use -1 for unlimited)` },
            { status: 400 }
          );
        }
        if (typedQuotas.maxBillsPerMonth !== undefined && typedQuotas.maxBillsPerMonth < -1) {
          return NextResponse.json(
            { error: `Invalid maxBillsPerMonth for ${tier}: must be >= -1` },
            { status: 400 }
          );
        }
        if (typedQuotas.maxReportsPerMonth !== undefined && typedQuotas.maxReportsPerMonth < -1) {
          return NextResponse.json(
            { error: `Invalid maxReportsPerMonth for ${tier}: must be >= -1` },
            { status: 400 }
          );
        }
      }
    }

    // Update Firestore
    if (configDoc.exists) {
      await configRef.update(updateData);
    } else {
      await configRef.set(updateData);
    }

    // Invalidate cache to force reload
    invalidateCache();

    // Fetch updated config
    const updatedRateLimits = await getRateLimitConfig(true);
    const updatedQuotas = await getQuotaConfig(true);

    return NextResponse.json({
      success: true,
      message: 'Rate limit configuration updated successfully',
      data: {
        rateLimits: updatedRateLimits,
        quotas: updatedQuotas,
      },
    });

  } catch (error) {
    console.error('Error updating rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to update rate limit configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/system-admin/rate-limits/reset
 * 
 * Reset rate limits for a specific tenant (clear their rate limit records)
 * 
 * Body:
 * {
 *   tenantId: string,
 *   operation?: 'billAnalysis' | 'reportGeneration' (optional, clears all if not provided)
 * }
 */
export async function POST(request: NextRequest) {
  // Verify SuperAdmin
  const superAdminId = await verifySuperAdmin(request);
  
  if (!superAdminId) {
    return NextResponse.json(
      { error: 'Unauthorized. SuperAdmin access required.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { tenantId, operation } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Validate tenant exists
    const tenantDoc = await adminDb.collection('tenants').doc(tenantId).get();
    
    if (!tenantDoc.exists) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Clear rate limits
    await clearRateLimit(tenantId, operation);

    return NextResponse.json({
      success: true,
      message: operation 
        ? `Rate limits reset for ${operation} for tenant ${tenantId}`
        : `All rate limits reset for tenant ${tenantId}`,
    });

  } catch (error) {
    console.error('Error resetting rate limits:', error);
    return NextResponse.json(
      { error: 'Failed to reset rate limits' },
      { status: 500 }
    );
  }
}
