/**
 * Tenant Usage API
 * 
 * GET - Retrieve current tenant's rate limit usage
 * 
 * Requires authentication. Returns usage for billAnalysis and reportGeneration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getRateLimitStatus, RATE_LIMIT_OPERATIONS } from '@/lib/rate-limiter';
import { getRateLimitForOperation } from '@/lib/rate-limit-config';

/**
 * GET /api/tenant/usage
 * 
 * Retrieve current tenant's rate limit usage
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const tenantId = decodedToken.tenantId as string;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'User is not associated with a tenant' },
        { status: 403 }
      );
    }

    // Get rate limits for each operation
    const [billAnalysisLimit, reportGenerationLimit] = await Promise.all([
      getRateLimitForOperation(RATE_LIMIT_OPERATIONS.BILL_ANALYSIS, 'minute'),
      getRateLimitForOperation(RATE_LIMIT_OPERATIONS.REPORT_GENERATION, 'minute'),
    ]);

    // Get current usage for each operation
    const [billAnalysisUsage, reportGenerationUsage] = await Promise.all([
      getRateLimitStatus(
        tenantId,
        RATE_LIMIT_OPERATIONS.BILL_ANALYSIS,
        billAnalysisLimit,
        60000 // 1 minute window
      ),
      getRateLimitStatus(
        tenantId,
        RATE_LIMIT_OPERATIONS.REPORT_GENERATION,
        reportGenerationLimit,
        60000
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        billAnalysis: {
          current: billAnalysisUsage.current,
          limit: billAnalysisUsage.limit,
          remaining: billAnalysisUsage.remaining,
          resetTime: billAnalysisUsage.resetTime.toISOString(),
          percentage: billAnalysisUsage.limit > 0 
            ? Math.round((billAnalysisUsage.current / billAnalysisUsage.limit) * 100)
            : 0,
        },
        reportGeneration: {
          current: reportGenerationUsage.current,
          limit: reportGenerationUsage.limit,
          remaining: reportGenerationUsage.remaining,
          resetTime: reportGenerationUsage.resetTime.toISOString(),
          percentage: reportGenerationUsage.limit > 0
            ? Math.round((reportGenerationUsage.current / reportGenerationUsage.limit) * 100)
            : 0,
        },
        tenantId,
      },
    });

  } catch (error) {
    console.error('Error fetching tenant usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant usage' },
      { status: 500 }
    );
  }
}
