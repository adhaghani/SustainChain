/**
 * Analytics & Benchmarking Helper Functions
 * Aggregate emissions data for sector comparisons and trend analysis
 */

import { db } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { TenantDocument } from '@/types/firestore';

// ============================================
// TYPES
// ============================================

export interface TenantEmissions {
  tenantId: string;
  tenantName: string;
  sector: string;
  city?: string;
  state?: string;
  totalEmissions: number;
  entryCount: number;
}

export interface SectorBenchmark {
  sector: string;
  average: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
  companyCount: number;
}

export interface TenantRanking {
  tenantId: string;
  emissions: number;
  rank: number;
  percentile: number;
  totalCompanies: number;
}

export interface RegionalStats {
  region: string;
  avgEmissions: number;
  companyCount: number;
}

export interface MonthlyTrend {
  month: string;
  tenantEmissions: number;
  sectorAverage: number;
}

export interface TopPerformer {
  tenantId: string;
  tenantName: string;
  sector: string;
  currentEmissions: number;
  previousEmissions: number;
  improvement: number; // percentage
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get start and end dates for a billing month
 */
function getMonthRange(date: Date): { start: Timestamp; end: Timestamp } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  
  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
}

/**
 * Format month as YYYY-MM
 */
function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Calculate percentile statistics from array of numbers
 */
function calculatePercentiles(values: number[]): {
  p25: number;
  p50: number;
  p75: number;
  min: number;
  max: number;
  avg: number;
} {
  if (values.length === 0) {
    return { p25: 0, p50: 0, p75: 0, min: 0, max: 0, avg: 0 };
  }

  const sorted = values.slice().sort((a, b) => a - b);
  const len = sorted.length;

  return {
    p25: sorted[Math.floor(len * 0.25)] || 0,
    p50: sorted[Math.floor(len * 0.5)] || 0,
    p75: sorted[Math.floor(len * 0.75)] || 0,
    min: sorted[0] || 0,
    max: sorted[len - 1] || 0,
    avg: values.reduce((sum, val) => sum + val, 0) / len,
  };
}

// ============================================
// TENANT EMISSIONS AGGREGATION
// ============================================

/**
 * Get all tenants with their total emissions for a specific month
 */
export async function getTenantEmissionsByMonth(
  month?: Date
): Promise<TenantEmissions[]> {
  const targetMonth = month || new Date();
  const { start, end } = getMonthRange(targetMonth);

  // Get all tenants
  const tenantsSnapshot = await db.collection('tenants').get();
  const tenants = tenantsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TenantDocument));

  // Aggregate emissions for each tenant
  const tenantEmissions: TenantEmissions[] = [];

  for (const tenant of tenants) {
    // Query entries for this tenant in the month
    const entriesSnapshot = await db
      .collection('tenants')
      .doc(tenant.id)
      .collection('entries')
      .where('billingDate', '>=', start)
      .where('billingDate', '<=', end)
      .where('status', '==', 'verified')
      .get();

    const totalEmissions = entriesSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.co2e || 0);
    }, 0);

    tenantEmissions.push({
      tenantId: tenant.id,
      tenantName: tenant.name,
      sector: tenant.sector,
      city: tenant.city,
      state: tenant.state,
      totalEmissions,
      entryCount: entriesSnapshot.size,
    });
  }

  return tenantEmissions;
}

/**
 * Get specific tenant's emissions for a month
 */
export async function getSingleTenantEmissions(
  tenantId: string,
  month?: Date
): Promise<TenantEmissions | null> {
  const targetMonth = month || new Date();
  const { start, end } = getMonthRange(targetMonth);

  // Get tenant document
  const tenantDoc = await db.collection('tenants').doc(tenantId).get();
  if (!tenantDoc.exists) {
    return null;
  }

  const tenant = tenantDoc.data() as TenantDocument;

  // Query entries
  const entriesSnapshot = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('entries')
    .where('billingDate', '>=', start)
    .where('billingDate', '<=', end)
    .where('status', '==', 'verified')
    .get();

  const totalEmissions = entriesSnapshot.docs.reduce((sum, doc) => {
    const data = doc.data();
    return sum + (data.co2e || 0);
  }, 0);

  return {
    tenantId: tenant.id,
    tenantName: tenant.name,
    sector: tenant.sector,
    city: tenant.city,
    state: tenant.state,
    totalEmissions,
    entryCount: entriesSnapshot.size,
  };
}

// ============================================
// SECTOR BENCHMARKING
// ============================================

/**
 * Calculate sector benchmarks for a specific month
 */
export async function getSectorBenchmarks(
  sector: string,
  month?: Date
): Promise<SectorBenchmark> {
  const allTenants = await getTenantEmissionsByMonth(month);
  const sectorTenants = allTenants.filter(t => t.sector === sector && t.totalEmissions > 0);

  if (sectorTenants.length === 0) {
    return {
      sector,
      average: 0,
      median: 0,
      p25: 0,
      p75: 0,
      min: 0,
      max: 0,
      companyCount: 0,
    };
  }

  const emissions = sectorTenants.map(t => t.totalEmissions);
  const stats = calculatePercentiles(emissions);

  return {
    sector,
    average: stats.avg,
    median: stats.p50,
    p25: stats.p25,
    p75: stats.p75,
    min: stats.min,
    max: stats.max,
    companyCount: sectorTenants.length,
  };
}

/**
 * Get all sector benchmarks
 */
export async function getAllSectorBenchmarks(
  month?: Date
): Promise<SectorBenchmark[]> {
  const allTenants = await getTenantEmissionsByMonth(month);
  const sectors = [...new Set(allTenants.map(t => t.sector))];

  const benchmarks: SectorBenchmark[] = [];

  for (const sector of sectors) {
    const sectorTenants = allTenants.filter(t => t.sector === sector && t.totalEmissions > 0);
    
    if (sectorTenants.length === 0) continue;

    const emissions = sectorTenants.map(t => t.totalEmissions);
    const stats = calculatePercentiles(emissions);

    benchmarks.push({
      sector,
      average: stats.avg,
      median: stats.p50,
      p25: stats.p25,
      p75: stats.p75,
      min: stats.min,
      max: stats.max,
      companyCount: sectorTenants.length,
    });
  }

  return benchmarks;
}

// ============================================
// TENANT RANKING
// ============================================

/**
 * Calculate tenant's rank and percentile within their sector
 */
export async function getTenantRanking(
  tenantId: string,
  month?: Date
): Promise<TenantRanking | null> {
  const tenantEmissions = await getSingleTenantEmissions(tenantId, month);
  if (!tenantEmissions) {
    return null;
  }

  const allTenants = await getTenantEmissionsByMonth(month);
  const sectorTenants = allTenants
    .filter(t => t.sector === tenantEmissions.sector && t.totalEmissions > 0)
    .sort((a, b) => a.totalEmissions - b.totalEmissions); // Lower is better

  const rank = sectorTenants.findIndex(t => t.tenantId === tenantId) + 1;
  const percentile = ((sectorTenants.length - rank) / sectorTenants.length) * 100;

  return {
    tenantId,
    emissions: tenantEmissions.totalEmissions,
    rank,
    percentile: Math.round(percentile),
    totalCompanies: sectorTenants.length,
  };
}

// ============================================
// REGIONAL COMPARISON
// ============================================

/**
 * Get average emissions by region/state
 */
export async function getRegionalStats(
  month?: Date
): Promise<RegionalStats[]> {
  const allTenants = await getTenantEmissionsByMonth(month);
  
  // Group by state
  const regionMap = new Map<string, { total: number; count: number }>();

  for (const tenant of allTenants) {
    if (!tenant.state || tenant.totalEmissions === 0) continue;

    const existing = regionMap.get(tenant.state) || { total: 0, count: 0 };
    regionMap.set(tenant.state, {
      total: existing.total + tenant.totalEmissions,
      count: existing.count + 1,
    });
  }

  const stats: RegionalStats[] = [];
  for (const [region, data] of regionMap.entries()) {
    stats.push({
      region,
      avgEmissions: data.total / data.count,
      companyCount: data.count,
    });
  }

  return stats.sort((a, b) => b.avgEmissions - a.avgEmissions);
}

// ============================================
// TREND ANALYSIS
// ============================================

/**
 * Get emission trends for a tenant over multiple months
 */
export async function getEmissionTrends(
  tenantId: string,
  months: number = 6
): Promise<MonthlyTrend[]> {
  const trends: MonthlyTrend[] = [];
  const currentDate = new Date();

  // Get tenant sector
  const tenantDoc = await db.collection('tenants').doc(tenantId).get();
  if (!tenantDoc.exists) {
    return [];
  }
  const tenant = tenantDoc.data() as TenantDocument;

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthStr = formatMonth(monthDate);

    // Get tenant emissions
    const tenantEmissions = await getSingleTenantEmissions(tenantId, monthDate);
    
    // Get sector average
    const sectorBenchmark = await getSectorBenchmarks(tenant.sector, monthDate);

    trends.push({
      month: monthStr,
      tenantEmissions: tenantEmissions?.totalEmissions || 0,
      sectorAverage: sectorBenchmark.average,
    });
  }

  return trends;
}

// ============================================
// TOP PERFORMERS
// ============================================

/**
 * Get top performers by improvement rate (current vs previous month)
 */
export async function getTopPerformers(
  sector: string,
  limit: number = 10
): Promise<TopPerformer[]> {
  const currentMonth = new Date();
  const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);

  const currentData = await getTenantEmissionsByMonth(currentMonth);
  const previousData = await getTenantEmissionsByMonth(previousMonth);

  const sectorTenants = currentData.filter(t => t.sector === sector);
  const performers: TopPerformer[] = [];

  for (const current of sectorTenants) {
    const previous = previousData.find(t => t.tenantId === current.tenantId);
    
    if (!previous || previous.totalEmissions === 0) continue;

    const improvement = ((previous.totalEmissions - current.totalEmissions) / previous.totalEmissions) * 100;

    performers.push({
      tenantId: current.tenantId,
      tenantName: current.tenantName,
      sector: current.sector,
      currentEmissions: current.totalEmissions,
      previousEmissions: previous.totalEmissions,
      improvement,
    });
  }

  return performers
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, limit);
}

// ============================================
// SECTOR COMPARISON DATA
// ============================================

/**
 * Get comprehensive sector comparison data for analytics page
 */
export interface SectorComparisonItem {
  label: string;
  emissions: number;
  rank?: number;
  isYou: boolean;
}

export async function getSectorComparison(
  tenantId: string,
  month?: Date
): Promise<SectorComparisonItem[]> {
  const tenantEmissions = await getSingleTenantEmissions(tenantId, month);
  if (!tenantEmissions) {
    return [];
  }

  const benchmark = await getSectorBenchmarks(tenantEmissions.sector, month);
  const ranking = await getTenantRanking(tenantId, month);

  if (!ranking) {
    return [];
  }

  return [
    {
      label: 'Your Company',
      emissions: tenantEmissions.totalEmissions,
      rank: ranking.rank,
      isYou: true,
    },
    {
      label: 'Top Performer',
      emissions: benchmark.min,
      rank: 1,
      isYou: false,
    },
    {
      label: '25th Percentile',
      emissions: benchmark.p25,
      rank: 25,
      isYou: false,
    },
    {
      label: 'Median (50th)',
      emissions: benchmark.median,
      rank: 50,
      isYou: false,
    },
    {
      label: 'Sector Average',
      emissions: benchmark.average,
      rank: 0,
      isYou: false,
    },
    {
      label: '75th Percentile',
      emissions: benchmark.p75,
      rank: 75,
      isYou: false,
    },
    {
      label: 'Bottom Performer',
      emissions: benchmark.max,
      rank: 100,
      isYou: false,
    },
  ];
}
