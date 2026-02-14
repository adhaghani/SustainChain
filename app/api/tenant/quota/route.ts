/**
 * Tenant Monthly Quota API
 * 
 * GET /api/tenant/quota
 * Returns current monthly quota usage for bill analysis and report generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getQuotaStatus, QUOTA_OPERATIONS } from '@/lib/quota-tracker';

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
    } catch (error) {
      console.error('Token verification error:', error);
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

    // Get quota status for both operations
    const [billAnalysisQuota, reportGenerationQuota] = await Promise.all([
      getQuotaStatus(tenantId, QUOTA_OPERATIONS.BILL_ANALYSIS),
      getQuotaStatus(tenantId, QUOTA_OPERATIONS.REPORT_GENERATION),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        billAnalysis: {
          current: billAnalysisQuota.current,
          limit: billAnalysisQuota.limit,
          remaining: billAnalysisQuota.remaining,
          resetTime: billAnalysisQuota.resetTime.toISOString(),
          percentUsed: Math.round(billAnalysisQuota.percentUsed),
          unlimited: billAnalysisQuota.limit === -1,
        },
        reportGeneration: {
          current: reportGenerationQuota.current,
          limit: reportGenerationQuota.limit,
          remaining: reportGenerationQuota.remaining,
          resetTime: reportGenerationQuota.resetTime.toISOString(),
          percentUsed: Math.round(reportGenerationQuota.percentUsed),
          unlimited: reportGenerationQuota.limit === -1,
        },
        tenantId,
      },
    });
  } catch (error) {
    console.error('Error fetching tenant quota:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quota information',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
