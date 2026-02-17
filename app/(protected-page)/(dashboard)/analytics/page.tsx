'use client';

import { useState } from 'react';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { CLIENT_RATE_LIMITS } from '@/lib/client-rate-limiter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { 
  IconTrendingDown,
  IconChartBar,
  IconLeaf,
  IconTarget,
  IconAward,
  IconDownload,
  IconRefresh,
  IconArrowDown,
  IconAlertTriangle
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalytics } from '@/hooks/use-analytics';
import { useLanguage } from '@/lib/language-context';

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const { data, loading, error, refetch } = useAnalytics(period);

  // Debounced refresh function for analytics data
  const debouncedRefetch = useDebouncedCallback(
    () => {
      refetch();
    },
    CLIENT_RATE_LIMITS.DEBOUNCE_MS,
    [refetch]
  );




  // If no data yet, show defaults for UI structure
  const yourPerformance = data?.yourPerformance || {
    currentEmissions: 0,
    previousEmissions: 0,
    sectorAverage: 0,
    percentile: 0,
    rank: 0,
    totalCompanies: 0,
    sector: "",
    improvement: 0,
    belowAverage: 0,
  };

  const sectorComparison = data?.sectorComparison || [];
  const regionalComparison = data?.regionalComparison || [];
  const topPerformers = data?.topPerformers || [];
  const emissionTrends = data?.emissionTrends || [];

  const maxEmissions = sectorComparison.length > 0 
    ? Math.max(...sectorComparison.map(s => s.emissions))
    : 1;


  if((data?.yourPerformance && data.yourPerformance.totalCompanies < 5)){
    return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.pages.analytics.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.pages.analytics.subtitle}
          </p>
        </div>
      </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <IconChartBar className="w-16 h-16 text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-semibold text-lg">{t.dashboard.pages.analytics.noAnalyticsData}</h3>
                <p className="text-sm text-muted-foreground max-w-lg mt-1">
                  {t.dashboard.pages.analytics.analyticsDataDesc}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
    )
  }
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.pages.analytics.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.pages.analytics.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => debouncedRefetch()} disabled={loading}>
            <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t.common.retry}
          </Button>
          <Button size="sm" disabled={loading || !data}>
            <IconDownload className="w-4 h-4 mr-2" />
            {t.dashboard.pages.reports.exportReport}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No Data State */}
      {!loading && !error && !data && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <IconChartBar className="w-16 h-16 text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-semibold text-lg">{t.dashboard.pages.analytics.noAnalyticsData}</h3>
                <p className="text-sm text-muted-foreground max-w-lg mt-1">
                  {t.dashboard.pages.analytics.analyticsDataDesc}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {(loading || data) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Select 
                value={period} 
                onValueChange={(value) => setPeriod(value as 'monthly' | 'quarterly' | 'yearly')}
                disabled={loading}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder={t.dashboard.pages.analytics.timePeriod} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t.dashboard.pages.analytics.monthly}</SelectItem>
                  <SelectItem value="quarterly">{t.dashboard.pages.analytics.quarterly}</SelectItem>
                  <SelectItem value="yearly">{t.dashboard.pages.analytics.yearly}</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={yourPerformance.sector} disabled={loading}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder={t.dashboard.pages.analytics.sectorLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={yourPerformance.sector ? yourPerformance.sector : 'NULL'} disabled={!yourPerformance.sector}>
                    {yourPerformance.sector || t.dashboard.pages.analytics.yourSector}
                  </SelectItem>
                </SelectContent> 
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.pages.analytics.yourRanking}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {yourPerformance.totalCompanies > 0 
                  ? t.dashboard.pages.analytics.rank({ rank: 100 - yourPerformance.percentile, total: yourPerformance.totalCompanies })
                  : t.dashboard.pages.analytics.notEnoughData}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {yourPerformance.rank > 0 
                  ? t.dashboard.pages.analytics.rank({ rank: yourPerformance.rank, total: yourPerformance.totalCompanies })
                  : t.dashboard.pages.analytics.notEnoughData}
              </p>
              <Progress value={yourPerformance.percentile} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.pages.analytics.vsSectorAverage}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${yourPerformance.belowAverage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {yourPerformance.belowAverage > 0 ? '-' : '+'}{Math.abs(yourPerformance.belowAverage).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.pages.analytics.belowSectorAvg({ percent: yourPerformance.belowAverage.toFixed(0) })}
              </p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${yourPerformance.belowAverage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <IconTrendingDown className="w-4 h-4" />
                <span>{t.dashboard.pages.analytics.betterThanAvg}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.pages.analytics.monthlyImprovement}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${yourPerformance.improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {yourPerformance.improvement > 0 ? '-' : '+'}{Math.abs(yourPerformance.improvement).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.pages.analytics.fromTo({ from: yourPerformance.previousEmissions.toFixed(0), to: yourPerformance.currentEmissions.toFixed(0) })}
              </p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${yourPerformance.improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <IconArrowDown className="w-4 h-4" />
                <span>{t.dashboard.pages.analytics.onTrackToTarget}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.pages.analytics.sector}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yourPerformance.sector}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.pages.analytics.companiesTracked({ count: yourPerformance.totalCompanies })}
              </p>
              <Badge variant="outline" className="mt-2">{t.dashboard.pages.analytics.sme}</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Highlight */}
      {!loading && data && yourPerformance.belowAverage > 0 && (
        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <IconAward className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">
                    {t.dashboard.pages.analytics.excellentPerformance}
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                    {t.dashboard.pages.analytics.advantageDesc({ percent: 100 - yourPerformance.percentile })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Sector Comparison Chart */}
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data && sectorComparison.length > 0 && (
        <Card>
          <CardHeader>
              <CardTitle>{t.dashboard.pages.analytics.sectorBenchmarking({ sector: yourPerformance.sector })}</CardTitle>
              <CardDescription>{t.dashboard.pages.analytics.positionRelative}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectorComparison.map((item) => {
              const percentage = maxEmissions > 0 ? (item.emissions / maxEmissions) * 100 : 0;
              
              return (
                <div key={item.label} className={`space-y-2 ${item.isYou ? 'p-3 bg-primary/10 rounded-lg border-2 border-primary' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.isYou && <IconTarget className="w-4 h-4 text-primary" />}
                      <span className={`text-sm font-medium ${item.isYou ? 'text-primary font-bold' : ''}`}>
                        {item.label}
                      </span>
                      {item.isYou && <Badge variant="default">You</Badge>}
                    </div>
                    <span className={`text-sm font-bold ${item.isYou ? 'text-primary' : ''}`}>
                      {item.emissions.toFixed(1)} kg
                    </span>
                  </div>
                  <Progress value={percentage} className={`h-3 ${item.isYou ? 'bg-primary/20' : ''}`} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Trend Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emission Trends */}
        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : data && emissionTrends.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.pages.analytics.emissionTrends}</CardTitle>
              <CardDescription>{t.dashboard.pages.analytics.yourEmissionsVsSector}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {emissionTrends.map((trend) => {
                const maxTrend = Math.max(trend.tenantEmissions, trend.sectorAverage);
                const yourPercentage = maxTrend > 0 ? (trend.tenantEmissions / maxTrend) * 100 : 0;
                const avgPercentage = maxTrend > 0 ? (trend.sectorAverage / maxTrend) * 100 : 0;
                
                return (
                  <div key={trend.month} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{trend.month}</span>
                      <div className="flex gap-4">
                        <span className="text-primary">{t.dashboard.pages.analytics.yourCompany}: {trend.tenantEmissions.toFixed(0)} kg</span>
                        <span className="text-muted-foreground">{t.dashboard.pages.analytics.industryAverage}: {trend.sectorAverage.toFixed(0)} kg</span>
                      </div>
                    </div>
                    <div className="relative h-6">
                      <Progress value={yourPercentage} className="h-3 absolute top-0" />
                      <Progress value={avgPercentage} className="h-3 absolute top-3 opacity-40" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Regional Comparison */}
        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : data && regionalComparison.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.pages.analytics.regionalComparison}</CardTitle>
              <CardDescription>{t.dashboard.pages.analytics.avgEmissionsByRegion}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {regionalComparison.map((region) => {
                const maxRegional = Math.max(...regionalComparison.map(r => r.avgEmissions));
                const percentage = maxRegional > 0 ? (region.avgEmissions / maxRegional) * 100 : 0;
                
                return (
                  <div key={region.region} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{region.region}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold">{region.avgEmissions.toFixed(1)} kg</p>
                        <p className="text-xs text-muted-foreground">{region.companyCount} {t.dashboard.pages.analytics.companiesTracked({ count: region.companyCount })}</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Performers Leaderboard */}
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data && topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAward className="w-5 h-5 text-yellow-500" />
                {t.dashboard.pages.analytics.topPerformersTitle({ sector: yourPerformance.sector })}
            </CardTitle>
              <CardDescription>{t.dashboard.pages.analytics.bestEmissionReduction}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((company, index) => (
                <div 
                  key={company.tenantId}
                  className={`flex items-center justify-between p-4 border rounded-lg ${company.isYou ? 'bg-primary/10 border-primary' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${company.isYou ? 'text-primary' : ''}`}>
                          {company.tenantName}
                        </p>
                        {company.isYou && <Badge variant="default">You</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{company.sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{company.currentEmissions.toFixed(1)} kg CO2e</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <IconTrendingDown className="w-3 h-3" />
                      <span>{Math.abs(company.improvement).toFixed(1)}% reduction</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights & Recommendations */}
      {!loading && data && (
        <Card>
          <CardHeader>
              <CardTitle>{t.dashboard.pages.analytics.aiGeneratedInsights}</CardTitle>
              <CardDescription>{t.dashboard.pages.analytics.personalizedRecommendations}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {yourPerformance.belowAverage > 0 && (
              <div className="flex gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <IconLeaf className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.dashboard.pages.analytics.competitiveAdvantage}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.pages.analytics.advantageDesc({ percent: 100 - yourPerformance.percentile })}
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.rank > 0 && yourPerformance.rank <= yourPerformance.totalCompanies * 0.35 && (
              <div className="flex gap-3 p-4 border rounded-lg">
                <IconTarget className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.dashboard.pages.analytics.targetTop25}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.pages.analytics.targetDesc({ sector: yourPerformance.sector })}
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.improvement > 0 && (
              <div className="flex gap-3 p-4 border rounded-lg">
                <IconChartBar className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.dashboard.pages.analytics.consistentImprovement}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.pages.analytics.improvementDesc({ percent: yourPerformance.improvement.toFixed(1) })}
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.improvement < 0 && (
              <div className="flex gap-3 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <IconAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.dashboard.pages.analytics.emissionsIncrease}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.pages.analytics.increaseDesc({ percent: Math.abs(yourPerformance.improvement).toFixed(1) })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;
