"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { IconLeaf, IconBolt, IconDroplet, IconGasStation, IconTrendingUp, IconTrendingDown, IconDownload, IconUpload } from "@tabler/icons-react";
import { useLanguage } from "@/lib/language-context";

const DashboardPage = () => {
  const { t } = useLanguage();
  
  // Mock data - will be replaced with real data from Firebase/BigQuery
  const currentMonthEmissions = 1247.5; // kg CO2e
  const previousMonthEmissions = 1380.2;
  const percentageChange = ((currentMonthEmissions - previousMonthEmissions) / previousMonthEmissions * 100).toFixed(1);
  const sectorPercentile = 68; // Top 32%

  const emissionBreakdown = [
    { type: t.dashboard.electricity, value: 872.3, icon: IconBolt, color: "text-yellow-500", percentage: 70 },
    { type: t.dashboard.fuel, value: 249.5, icon: IconGasStation, color: "text-blue-500", percentage: 20 },
    { type: t.dashboard.water, value: 125.7, icon: IconDroplet, color: "text-cyan-500", percentage: 10 },
  ];

  const monthlyTrend = [
    { month: "Aug", value: 1456 },
    { month: "Sep", value: 1389 },
    { month: "Oct", value: 1402 },
    { month: "Nov", value: 1380 },
    { month: "Dec", value: 1348 },
    { month: "Jan", value: 1247 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconUpload className="w-4 h-4 mr-2" />
            {t.dashboard.common.uploadBill}
          </Button>
          <Button size="sm">
            <IconDownload className="w-4 h-4 mr-2" />
            {t.dashboard.common.exportReport}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.common.totalEmissions}</CardTitle>
            <IconLeaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthEmissions.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {parseFloat(percentageChange) < 0 ? (
                <>
                  <IconTrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{Math.abs(parseFloat(percentageChange))}% {t.dashboard.common.fromLastMonth}</span>
                </>
              ) : (
                <>
                  <IconTrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">{percentageChange}% {t.dashboard.common.fromLastMonth}</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.common.sectorRanking}</CardTitle>
            <Badge variant="secondary">Manufacturing</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top {100 - sectorPercentile}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.dashboard.common.betterThanPeers.replace('{percent}', sectorPercentile.toString())}
            </p>
            <Progress value={sectorPercentile} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.common.electricityUsage}</CardTitle>
            <IconBolt className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,486 kWh</div>
            <p className="text-xs text-muted-foreground mt-1">
              872.3 kg CO2e (70% {t.dashboard.common.ofTotal})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Entries</CardTitle>
            <Badge variant="outline">This Month</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Bills</div>
            <p className="text-xs text-muted-foreground mt-1">
              8 auto-extracted, 4 manual
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
            <CardDescription>Carbon footprint by utility type (January 2026)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emissionBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="text-sm font-bold">{item.value} kg CO2e</div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.percentage}% {t.dashboard.common.ofTotal}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.monthlyTrend}</CardTitle>
            <CardDescription>Carbon emissions over time (kg CO2e)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrend.map((data, idx) => {
                const maxValue = Math.max(...monthlyTrend.map(d => d.value));
                const percentage = (data.value / maxValue) * 100;
                const isLatest = idx === monthlyTrend.length - 1;
                
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isLatest ? 'text-primary' : ''}`}>
                        {data.month}
                      </span>
                      <span className={`text-sm font-bold ${isLatest ? 'text-primary' : ''}`}>
                        {data.value} kg
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.insights}</CardTitle>
          <CardDescription>Recommendations to reduce your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 border rounded-lg">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <IconTrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Great Progress!</h4>
                <p className="text-sm text-muted-foreground">
                  Your emissions decreased by 9.6% compared to last month. Your electricity usage optimization is working well.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4 p-4 border rounded-lg">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <IconBolt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Peak Hour Usage</h4>
                <p className="text-sm text-muted-foreground">
                  Consider shifting high-energy operations to off-peak hours (10 PM - 8 AM) to reduce costs by up to 30%.
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
                  Your current performance aligns with SDG Goals 8, 9, and 12. Maintain this trend to qualify for ESG incentives.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;