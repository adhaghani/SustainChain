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
import { Separator } from "@/components/ui/separator";
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
import { useRouter } from "next/navigation";
import { useMemo } from "react";

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
              <CardTitle>Failed to Load Dashboard</CardTitle>
            </div>
            <CardDescription>{analyticsError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refetchAnalytics} className="w-full">
              <IconRefresh className="w-4 h-4 mr-2" />
              Retry
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
  const improvement = analyticsData?.yourPerformance?.improvement || 0;

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
              ? `${t.dashboard.subtitle} (Read-only access)`
              : t.dashboard.subtitle}
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
              👁️ You have view-only access. Contact your administrator to
              request additional permissions.
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
            <CardTitle className="text-sm font-medium">Data Entries</CardTitle>
            <Badge variant="outline">This Month</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentEntries.length} Bills
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {recentEntries.filter((e) => e.extractionConfidence && e.extractionConfidence > 70).length} auto-extracted,{" "}
              {recentEntries.filter((e) => !e.extractionConfidence || e.extractionConfidence <= 70).length} manual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emission Breakdown</CardTitle>
            <CardDescription>
              Carbon footprint by utility type (Current Month)
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
                <p>No emission data available yet.</p>
                {canUploadBills && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push("/entries")}
                  >
                    <IconUpload className="w-4 h-4 mr-2" />
                    Upload Your First Bill
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.monthlyTrend}</CardTitle>
            <CardDescription>
              Carbon emissions over time (kg CO2e)
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
                          Sector avg: {data.sectorAverage.toFixed(0)} kg
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No trend data available yet.</p>
                <p className="text-xs mt-2">
                  Upload bills for at least 2 months to see trends.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations - Admin/Clerk only */}
      {canViewDetailedAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.insights}</CardTitle>
            <CardDescription>
              Recommendations to reduce your carbon footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvement < 0 ? (
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <IconTrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      Great Progress!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your emissions decreased by{" "}
                      {Math.abs(improvement).toFixed(1)}% compared to last
                      month. Your optimization efforts are working well.
                    </p>
                  </div>
                </div>
              ) : improvement > 0 ? (
                <div className="flex gap-4 p-4 border rounded-lg border-amber-200">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <IconTrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      Emissions Increased
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your emissions increased by {improvement.toFixed(1)}%
                      compared to last month. Consider reviewing your energy
                      usage patterns.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 p-4 border rounded-lg">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <IconLeaf className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      Stable Performance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your emissions remain stable. Continue monitoring your
                      usage to identify optimization opportunities.
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <IconBolt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">
                    Peak Hour Usage
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Consider shifting high-energy operations to off-peak hours
                    (10 PM - 8 AM) to reduce costs by up to 30%.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4 p-4 border rounded-lg">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <IconLeaf className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">SDG Alignment</h4>
                  <p className="text-sm text-muted-foreground">
                    Your current performance aligns with SDG Goals 8, 9, and 12.
                    Maintain this trend to qualify for ESG incentives.
                  </p>
                </div>
              </div>

              {sectorPercentile >= 75 && (
                <>
                  <Separator />
                  <div className="flex gap-4 p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                      <IconLeaf className="w-5 h-5 text-green-700 dark:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 text-green-900 dark:text-green-100">
                        🎉 Top Performer!
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        You&apos;re in the top {100 - sectorPercentile}% of
                        companies in your sector. Consider sharing your best
                        practices with others!
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Viewer-specific message */}
      {role === "viewer" && (
        <Card>
          <CardHeader>
            <CardTitle>Need More Access?</CardTitle>
            <CardDescription>
              Contact your administrator for additional permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              As a viewer, you can see emission data and reports but cannot
              upload bills or make changes. If you need to contribute data or
              generate reports, please contact {userData?.tenantName || "your"}{" "}
              administrator.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/reports")}
              >
                View Reports
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/entries")}
              >
                View All Entries
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
