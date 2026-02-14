"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconLeaf,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconTrendingUp,
  IconTrendingDown,
  IconDownload,
  IconUpload,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { useAnalytics } from "@/hooks/use-analytics";
import { useRecentEntries } from "@/hooks/use-entries";
import { useTenantQuota } from "@/hooks/use-tenant-quota";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { CLIENT_RATE_LIMITS } from "@/lib/client-rate-limiter";

const DashboardPage = () => {
  const { t } = useLanguage();
  const { userData, role } = useAuth();
  const router = useRouter();
  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useAnalytics("monthly");
  const { entries: recentEntries, loading: entriesLoading } =
    useRecentEntries();
  const { data: quotaData } = useTenantQuota();

  // Debounced refresh function for dashboard data
  const debouncedRefetch = useDebouncedCallback(
    () => {
      refetchAnalytics();
    },
    CLIENT_RATE_LIMITS.DEBOUNCE_MS,
    [refetchAnalytics]
  );

    
  // Compute emission breakdown from analytics data
  const emissionBreakdown = useMemo(() => {
    if (!analyticsData?.yourPerformance) {
      return [];
    }

    

    const total = analyticsData.yourPerformance.currentEmissions;

    // Mock breakdown - in production, this would come from aggregated entry data
    return [
      {
        type: t.dashboard.electricity,
        value: total * 0.7,
        icon: IconBolt,
        color: "text-yellow-500",
        percentage: 70,
      },
      {
        type: t.dashboard.fuel,
        value: total * 0.2,
        icon: IconGasStation,
        color: "text-blue-500",
        percentage: 20,
      },
      {
        type: t.dashboard.water,
        value: total * 0.1,
        icon: IconDroplet,
        color: "text-cyan-500",
        percentage: 10,
      },
    ];
  }, [analyticsData, t]);

  

  // Format trend data
  const monthlyTrend = useMemo(() => {
    if (!analyticsData?.emissionTrends) return [];
    return analyticsData.emissionTrends.map((trend) => ({
      month: trend.month,
      value: trend.tenantEmissions,
      sectorAverage: trend.sectorAverage,
    }));
  }, [analyticsData]);

  // Calculate change percentage
  const percentageChange = useMemo(() => {
    if (!analyticsData?.yourPerformance) return null;
    const current = analyticsData.yourPerformance.currentEmissions;
    const previous = analyticsData.yourPerformance.previousEmissions;
    if (!previous) return null;
    return (((current - previous) / previous) * 100).toFixed(1);
  }, [analyticsData]);


  if(userData?.role === "superadmin") {
    return router.replace("/system-admin");
  }


  // Check permissions based on role
  const canUploadBills = role === "admin" || role === "clerk";
  const canExportReports =
    role === "admin" || role === "clerk" || role === "viewer";
  const canViewDetailedAnalytics = role === "admin" || role === "clerk";

  // Loading state
  if (analyticsLoading || entriesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (analyticsError) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <IconAlertCircle className="w-5 h-5" />
              <CardTitle>{t.dashboard.pages.dashboard.failedToLoad}</CardTitle>
            </div>
            <CardDescription>{analyticsError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => debouncedRefetch()} className="w-full">
              <IconRefresh className="w-4 h-4 mr-2" />
              {t.dashboard.pages.dashboard.retry}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentEmissions =
    analyticsData?.yourPerformance?.currentEmissions || 0;
  const sectorPercentile = analyticsData?.yourPerformance?.percentile || 0;
  const sectorName = analyticsData?.yourPerformance?.sector || "N/A";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === "viewer"
              ? `${t.dashboard.pages.dashboard.subtitle} ${t.dashboard.pages.dashboard.readOnlyAccess}`
              : t.dashboard.pages.dashboard.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          {canUploadBills && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/entries")}
            >
              <IconUpload className="w-4 h-4 mr-2" />
              {t.dashboard.common.uploadBill}
            </Button>
          )}
          {canExportReports && (
            <Button size="sm" onClick={() => router.push("/reports")}>
              <IconDownload className="w-4 h-4 mr-2" />
              {t.dashboard.common.exportReport}
            </Button>
          )}
        </div>
      </div>

      {/* Role-based info banner */}
      {role === "viewer" && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {t.dashboard.pages.dashboard.viewerBanner}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.dashboard.common.totalEmissions}
            </CardTitle>
            <IconLeaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentEmissions.toFixed(1)} kg
            </div>
            {percentageChange && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {parseFloat(percentageChange) < 0 ? (
                  <>
                    <IconTrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">
                      {Math.abs(parseFloat(percentageChange))}%{" "}
                      {t.dashboard.common.fromLastMonth}
                    </span>
                  </>
                ) : (
                  <>
                    <IconTrendingUp className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-500">
                      {percentageChange}% {t.dashboard.common.fromLastMonth}
                    </span>
                  </>
                )}
              </p>
            )}
          </CardContent>
        </Card>

        {canViewDetailedAnalytics && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.dashboard.common.sectorRanking}
              </CardTitle>
              <Badge variant="secondary">{sectorName}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Top {100 - sectorPercentile}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.dashboard.common.betterThanPeers.replace(
                  "{percent}",
                  sectorPercentile.toString(),
                )}
              </p>
              <Progress value={sectorPercentile} className="mt-2" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.dashboard.common.electricityUsage}
            </CardTitle>
            <IconBolt className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emissionBreakdown.length > 0
                ? (emissionBreakdown[0].value / 0.586).toFixed(0)
                : "0"}{" "}
              kWh
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {emissionBreakdown.length > 0
                ? emissionBreakdown[0].value.toFixed(1)
                : "0"}{" "}
              kg CO2e (
              {emissionBreakdown.length > 0
                ? emissionBreakdown[0].percentage
                : 0}
              % {t.dashboard.common.ofTotal})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.pages.dashboard.dataEntries}</CardTitle>
            <Badge variant="outline">{t.dashboard.pages.dashboard.thisMonth}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentEntries.length} {t.dashboard.pages.dashboard.bills}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {
                recentEntries.filter(
                  (e) =>
                    typeof e.extractionConfidence === "number" &&
                    e.extractionConfidence > 70,
                ).length
              }{" "}
              {t.dashboard.pages.dashboard.autoExtracted},{" "}
              {
                recentEntries.filter(
                  (e) =>
                    typeof e.extractionConfidence !== "number" ||
                    e.extractionConfidence <= 70,
                ).length
              }{" "}
              {t.dashboard.pages.dashboard.manual}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Monthly Quota (Admin Only) */}
      {role === "admin" && quotaData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Quota Usage</CardTitle>
                <CardDescription>
                  {quotaData.billAnalysis.unlimited ? "Unlimited plan" : "Track your monthly API usage limits"}
                </CardDescription>
              </div>
              {!quotaData.billAnalysis.unlimited && (
                <Badge variant={
                  quotaData.billAnalysis.percentUsed > 80 || quotaData.reportGeneration.percentUsed > 80
                    ? "destructive"
                    : quotaData.billAnalysis.percentUsed > 50 || quotaData.reportGeneration.percentUsed > 50
                    ? "default"
                    : "secondary"
                }>
                  {quotaData.billAnalysis.current + quotaData.reportGeneration.current} / {quotaData.billAnalysis.limit + quotaData.reportGeneration.limit} used
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bill Analysis Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IconBolt className="w-4 h-4 text-primary" />
                  <span className="font-medium">Bill Analysis (Gemini API)</span>
                </div>
                <span className="text-muted-foreground">
                  {quotaData.billAnalysis.unlimited ? "Unlimited" : `${quotaData.billAnalysis.current} / ${quotaData.billAnalysis.limit}`}
                </span>
              </div>
              {!quotaData.billAnalysis.unlimited && (
                <>
                  <Progress 
                    value={quotaData.billAnalysis.percentUsed} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {quotaData.billAnalysis.remaining} remaining
                    </span>
                    <span>
                      Resets {new Date(quotaData.billAnalysis.resetTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Report Generation Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IconDownload className="w-4 h-4 text-primary" />
                  <span className="font-medium">Report Generation (PDF)</span>
                </div>
                <span className="text-muted-foreground">
                  {quotaData.reportGeneration.unlimited ? "Unlimited" : `${quotaData.reportGeneration.current} / ${quotaData.reportGeneration.limit}`}
                </span>
              </div>
              {!quotaData.reportGeneration.unlimited && (
                <>
                  <Progress 
                    value={quotaData.reportGeneration.limit === 0 ? 100 : quotaData.reportGeneration.percentUsed} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {quotaData.reportGeneration.remaining} remaining
                    </span>
                    <span>
                      Resets {new Date(quotaData.reportGeneration.resetTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Warning if approaching quota limit */}
            {!quotaData.billAnalysis.unlimited && (quotaData.billAnalysis.percentUsed > 80 || quotaData.reportGeneration.percentUsed > 80) && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                <IconAlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-destructive">Approaching Monthly Quota Limit</p>
                  <p className="text-muted-foreground mt-1">
                    You&apos;ve used over 80% of your monthly quota. Consider upgrading to avoid service interruption.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 
      {/* Charts and Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.pages.dashboard.emissionBreakdown}</CardTitle>
            <CardDescription>
              {t.dashboard.pages.dashboard.emissionBreakdownDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emissionBreakdown.length > 0 ? (
              emissionBreakdown.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <div className="text-sm font-bold">
                        {item.value.toFixed(1)} kg CO2e
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {item.percentage}% {t.dashboard.common.ofTotal}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>{t.dashboard.pages.dashboard.noEmissionData}</p>
                {canUploadBills && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push("/entries")}
                  >
                    <IconUpload className="w-4 h-4 mr-2" />
                    {t.dashboard.pages.dashboard.uploadFirstBill}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.pages.dashboard.monthlyTrend}</CardTitle>
            <CardDescription>
              {t.dashboard.pages.dashboard.monthlyTrendDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length > 0 ? (
              <div className="space-y-4">
                {monthlyTrend.map((data, idx) => {
                  const maxValue = Math.max(
                    ...monthlyTrend.map((d) => d.value),
                  );
                  const percentage =
                    maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                  const isLatest = idx === monthlyTrend.length - 1;

                  if(data.value.toFixed(0) === "0") {
                    return null; // Skip months with 0 emissions
                  }

                  return (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${isLatest ? "text-primary" : ""}`}
                        >
                          {data.month}
                        </span>
                        <span
                          className={`text-sm font-bold ${isLatest ? "text-primary" : ""}`}
                        >
                          {data.value.toFixed(0)} kg
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      {canViewDetailedAnalytics && data.sectorAverage && (
                        <div className="text-xs text-muted-foreground">
                          {t.dashboard.pages.dashboard.sectorAvg}: {data.sectorAverage.toFixed(0)} kg
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>{t.dashboard.pages.dashboard.noTrendData}</p>
                <p className="text-xs mt-2">
                  {t.dashboard.pages.dashboard.uploadForTrends}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Viewer-specific message */}
      {role === "viewer" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.pages.dashboard.needMoreAccess}</CardTitle>
            <CardDescription>
              {t.dashboard.pages.dashboard.contactAdmin}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t.dashboard.pages.dashboard.viewerMessage.replace(
                "{tenantName}",
                userData?.tenantName || "your",
              )}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/reports")}
              >
                {t.dashboard.pages.dashboard.viewReports}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/entries")}
              >
                {t.dashboard.pages.dashboard.viewAllEntries}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
