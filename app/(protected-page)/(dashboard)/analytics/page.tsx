'use client';

import { useState } from 'react';
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

const AnalyticsPage = () => {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const { data, loading, error, refetch } = useAnalytics(period);




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
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Benchmarking</h1>
          <p className="text-muted-foreground mt-1">
            Compare your carbon footprint against sector peers and track improvements
          </p>
        </div>
      </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <IconChartBar className="w-16 h-16 text-muted-foreground opacity-50" />
              <div>
                <h3 className="font-semibold text-lg">No Analytics Data Available Yet</h3>
                <p className="text-sm text-muted-foreground max-w-lg mt-1">
                  The system either does not have enough data to generate analytics or your sector is not represented sufficiently for benchmarking. Do not worry, it will be available the more company/entries you uploaded.
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Benchmarking</h1>
          <p className="text-muted-foreground mt-1">
            Compare your carbon footprint against sector peers and track improvements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
            <IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button size="sm" disabled={loading || !data}>
            <IconDownload className="w-4 h-4 mr-2" />
            Export Report
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
                <h3 className="font-semibold text-lg">No Analytics Data Available Yet</h3>
                <p className="text-sm text-muted-foreground max-w-lg mt-1">
                  The system either does not have enough data to generate analytics or your sector is not represented sufficiently for benchmarking. Do not worry, it will be available the more company/entries you uploaded.
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
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={yourPerformance.sector} disabled={loading}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={yourPerformance.sector ? yourPerformance.sector : 'NULL'} disabled={!yourPerformance.sector}>
                    {yourPerformance.sector || 'Your Sector'}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {yourPerformance.totalCompanies > 0 
                  ? `Top ${100 - yourPerformance.percentile}%`
                  : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {yourPerformance.rank > 0 
                  ? `Rank #${yourPerformance.rank} of ${yourPerformance.totalCompanies} companies`
                  : 'Not enough data'}
              </p>
              <Progress value={yourPerformance.percentile} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">vs Sector Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${yourPerformance.belowAverage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {yourPerformance.belowAverage > 0 ? '-' : '+'}{Math.abs(yourPerformance.belowAverage).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {yourPerformance.belowAverage > 0 
                  ? `${yourPerformance.belowAverage.toFixed(0)}% below sector average`
                  : `${Math.abs(yourPerformance.belowAverage).toFixed(0)}% above sector average`}
              </p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${yourPerformance.belowAverage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <IconTrendingDown className="w-4 h-4" />
                <span>{yourPerformance.belowAverage > 0 ? 'Better than average' : 'Above average'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${yourPerformance.improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {yourPerformance.improvement > 0 ? '-' : '+'}{Math.abs(yourPerformance.improvement).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {yourPerformance.previousEmissions.toFixed(0)} to {yourPerformance.currentEmissions.toFixed(0)} kg
              </p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${yourPerformance.improvement > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <IconArrowDown className="w-4 h-4" />
                <span>{yourPerformance.improvement > 0 ? 'On track to target' : 'Increasing'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yourPerformance.sector}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {yourPerformance.totalCompanies} companies tracked
              </p>
              <Badge variant="outline" className="mt-2">SME</Badge>
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
                  Excellent Performance! 🎉
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  You&apos;re emitting {yourPerformance.belowAverage.toFixed(0)}% less than the {yourPerformance.sector} sector average. 
                  Keep up the great work to maintain your competitive advantage.
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
            <CardTitle>Sector Benchmarking - {yourPerformance.sector}</CardTitle>
            <CardDescription>Your position relative to industry peers (kg CO2e/month)</CardDescription>
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
              <CardTitle>Emission Trends</CardTitle>
              <CardDescription>Your emissions vs sector average over time</CardDescription>
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
                        <span className="text-primary">You: {trend.tenantEmissions.toFixed(0)} kg</span>
                        <span className="text-muted-foreground">Avg: {trend.sectorAverage.toFixed(0)} kg</span>
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
              <CardTitle>Regional Comparison</CardTitle>
              <CardDescription>Average emissions by state/region</CardDescription>
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
                        <p className="text-xs text-muted-foreground">{region.companyCount} companies</p>
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
              Top Performers - {yourPerformance.sector}
            </CardTitle>
            <CardDescription>Companies with the best emission reduction rates</CardDescription>
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
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>Personalized recommendations based on benchmarking data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {yourPerformance.belowAverage > 0 && (
              <div className="flex gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <IconLeaf className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Competitive Advantage</h4>
                  <p className="text-sm text-muted-foreground">
                    Your low carbon footprint is a strong selling point for ESG-conscious buyers. 
                    Highlight your top {100 - yourPerformance.percentile}% ranking in proposals to showcase your sustainability commitment.
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.rank > 0 && yourPerformance.rank <= yourPerformance.totalCompanies * 0.35 && (
              <div className="flex gap-3 p-4 border rounded-lg">
                <IconTarget className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Target for Top 25%</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re close to breaking into the top 25% of {yourPerformance.sector} companies. 
                    Focus on optimizing electricity usage during peak hours to reach this milestone.
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.improvement > 0 && (
              <div className="flex gap-3 p-4 border rounded-lg">
                <IconChartBar className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Consistent Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve reduced emissions by {yourPerformance.improvement.toFixed(1)}% this month. 
                    This trend puts you on track to achieve sustainability targets faster.
                  </p>
                </div>
              </div>
            )}

            {yourPerformance.improvement < 0 && (
              <div className="flex gap-3 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <IconAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Emissions Increase Detected</h4>
                  <p className="text-sm text-muted-foreground">
                    Your emissions increased by {Math.abs(yourPerformance.improvement).toFixed(1)}% this month. 
                    Review recent activities and consider implementing energy-saving measures.
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
