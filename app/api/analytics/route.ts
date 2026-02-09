/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Analytics API Route
 * Provides sector benchmarking, ranking, and trend data
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/rbac';
import {
  getSingleTenantEmissions,
  getTenantRanking,
  getSectorBenchmarks,
  getRegionalStats,
  getEmissionTrends,
  getTopPerformers,
  getSectorComparison,
} from '@/lib/analytics-helpers';
import { getTenantDocument } from '@/lib/firestore-helpers';
import type { ApiResponse } from '@/types/firestore';

export const runtime = 'nodejs';
export const maxDuration = 30; // Analytics queries may be slower

interface AnalyticsData {
  yourPerformance: {
    currentEmissions: number;
    previousEmissions: number;
    sectorAverage: number;
    percentile: number;
    rank: number;
    totalCompanies: number;
    sector: string;
    improvement: number;
    belowAverage: number;
  };
  sectorComparison: Array<{
    label: string;
    emissions: number;
    rank?: number;
    isYou: boolean;
  }>;
  regionalComparison: Array<{
    region: string;
    avgEmissions: number;
    companyCount: number;
  }>;
  emissionTrends: Array<{
    month: string;
    tenantEmissions: number;
    sectorAverage: number;
  }>;
  topPerformers: Array<{
    tenantId: string;
    tenantName: string;
    sector: string;
    currentEmissions: number;
    previousEmissions: number;
    improvement: number;
    isYou: boolean;
  }>;
}

export async function GET(request: NextRequest) {
  // Check permission
  const authResult = await requirePermission(request, 'VIEW_ANALYTICS');
  
  if (!authResult.authorized) {
    return authResult.response;
  }

  const { user } = authResult;

  try {
    // Get tenant document for sector information
    const tenant = await getTenantDocument(user.tenantId);
    if (!tenant) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Parallel queries for performance
    const [
      currentEmissions,
      previousMonthEmissions,
      ranking,
      sectorBenchmark,
      sectorComparison,
      regionalStats,
      trends,
      topPerformers,
    ] = await Promise.all([
      getSingleTenantEmissions(user.tenantId),
      getSingleTenantEmissions(
        user.tenantId,
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      ),
      getTenantRanking(user.tenantId),
      getSectorBenchmarks(tenant.sector),
      getSectorComparison(user.tenantId),
      getRegionalStats(),
      getEmissionTrends(user.tenantId, 7), // 7 months for better trends
      getTopPerformers(tenant.sector, 10),
    ]);

    // Calculate metrics
    const current = currentEmissions?.totalEmissions || 0;
    const previous = previousMonthEmissions?.totalEmissions || 0;
    const improvement = previous > 0 ? ((previous - current) / previous) * 100 : 0;
    const belowAverage = sectorBenchmark.average > 0 
      ? ((sectorBenchmark.average - current) / sectorBenchmark.average) * 100 
      : 0;

    // Mark user in top performers
    const topPerformersWithFlag = topPerformers.map(performer => ({
      ...performer,
      isYou: performer.tenantId === user.tenantId,
    }));

    const analyticsData: AnalyticsData = {
      yourPerformance: {
        currentEmissions: current,
        previousEmissions: previous,
        sectorAverage: sectorBenchmark.average,
        percentile: ranking?.percentile || 0,
        rank: ranking?.rank || 0,
        totalCompanies: ranking?.totalCompanies || 0,
        sector: tenant.sector,
        improvement,
        belowAverage,
      },
      sectorComparison,
      regionalComparison: regionalStats,
      emissionTrends: trends,
      topPerformers: topPerformersWithFlag,
    };

    return NextResponse.json<ApiResponse<AnalyticsData>>({
      success: true,
      data: analyticsData,
    });
  } catch (error: any) {
    console.error('Analytics API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch analytics data',
        code: 'ANALYTICS_ERROR',
      },
      { status: 500 }
    );
  }
}
