'use client';

import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  IconDownload, 
  IconFileTypePdf, 
  IconCalendar, 
  IconBuildingFactory,
  IconLeaf,
  IconTrendingDown,
  IconTrendingUp,
  IconShare,
  IconEye,
  IconRefresh
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenantQuota } from "@/hooks/use-tenant-quota";
import { useCompletedReports } from "@/hooks/use-reports";
import { useEntries } from "@/hooks/use-entries";
import { toast } from "sonner";

const ReportsPage = () => {
  const { data: quotaData, loading: quotaLoading } = useTenantQuota();
  const { reports, loading: reportsLoading, error: reportsError, refetch: refetchReports } = useCompletedReports(20);
  const { entries, loading: entriesLoading } = useEntries({ limitCount: 100 });

  // Check report generation quota
  const reportQuotaExceeded = quotaData && !quotaData.reportGeneration.unlimited && quotaData.reportGeneration.remaining === 0;

  // Compute emission trends from entries
  const emissionTrend = useMemo(() => {
    if (entriesLoading || !entries.length) {
      return { current: 0, previous: 0, change: 0 };
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    let currentMonthEmissions = 0;
    let previousMonthEmissions = 0;

    entries.forEach(entry => {
      let entryDate: Date;
      if (entry.billingDate && typeof entry.billingDate === 'object' && 'toDate' in entry.billingDate) {
        entryDate = entry.billingDate.toDate();
      } else if (entry.billingDate) {
        entryDate = new Date(entry.billingDate as string);
      } else {
        return; // Skip entries without billing date
      }
      
      if (entryDate >= currentMonthStart) {
        currentMonthEmissions += entry.co2e || 0;
      } else if (entryDate >= previousMonthStart && entryDate <= previousMonthEnd) {
        previousMonthEmissions += entry.co2e || 0;
      }
    });

    const change = previousMonthEmissions > 0 
      ? ((currentMonthEmissions - previousMonthEmissions) / previousMonthEmissions) * 100 
      : 0;

    return {
      current: parseFloat(currentMonthEmissions.toFixed(2)),
      previous: parseFloat(previousMonthEmissions.toFixed(2)),
      change: parseFloat(change.toFixed(1))
    };
  }, [entries, entriesLoading]);

  // Show warning toast when approaching quota limit
  useEffect(() => {
    if (!quotaLoading && quotaData && !quotaData.reportGeneration.unlimited) {
      if (reportQuotaExceeded) {
        const resetDate = new Date(quotaData.reportGeneration.resetTime).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        
        toast.error("Report Generation Quota Exceeded", {
          description: `You have used all ${quotaData.reportGeneration.limit} report generations for this month. Your quota resets on ${resetDate}.`,
          duration: 6000,
        });
      } else if (quotaData.reportGeneration.percentUsed >= 80) {
        toast.warning("Approaching Quota Limit", {
          description: `You have ${quotaData.reportGeneration.remaining} report generations remaining this month.`,
          duration: 5000,
        });
      }
    }
  }, [quotaData, quotaLoading, reportQuotaExceeded]);

  // Show error toast if reports failed to load
  useEffect(() => {
    if (reportsError) {
      toast.error("Failed to load reports", {
        description: "Please try refreshing the page.",
      });
    }
  }, [reportsError]);

  // Sector comparison data (placeholder - will be calculated during actual report generation)
  const sectorComparison = {
    yourEmissions: emissionTrend.current,
    sectorAverage: 1556.3,
    percentile: 68,
    sector: "Manufacturing"
  };

  // SDG goals data (placeholder - will be calculated during actual report generation)
  const sdgGoals = [
    { number: 8, title: "Decent Work and Economic Growth", alignment: 85 },
    { number: 9, title: "Industry, Innovation and Infrastructure", alignment: 78 },
    { number: 12, title: "Responsible Consumption and Production", alignment: 92 },
  ];

  const formatDate = (date: string | Date | { toDate: () => Date } | undefined) => {
    if (!date) return 'N/A';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'object' && 'toDate' in date) {
      dateObj = date.toDate();
    } else {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ESG Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and download compliance-ready ESG reports
          </p>
        </div>
        <Button 
          disabled={reportQuotaExceeded || quotaLoading}
          onClick={() => {
            if (reportQuotaExceeded) {
              toast.error("Cannot Generate Report", {
                description: "You have exceeded your monthly report generation quota.",
              });
            }
          }}
        >
          <IconDownload className="w-4 h-4 mr-2" />
          {reportQuotaExceeded ? 'Quota Exceeded' : 'Generate New Report'}
        </Button>
      </div>

      {/* Report Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Generate ESG Report</CardTitle>
          <CardDescription>Create a comprehensive carbon footprint report for stakeholders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Configuration */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reporting Period</label>
              <Select defaultValue="jan2026">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan2026">January 2026</SelectItem>
                  <SelectItem value="dec2025">December 2025</SelectItem>
                  <SelectItem value="nov2025">November 2025</SelectItem>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                  <SelectItem value="2025">Full Year 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Language</label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                  <SelectItem value="both">Bilingual (EN/MS)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (Recommended)</SelectItem>
                  <SelectItem value="excel">Excel Workbook</SelectItem>
                  <SelectItem value="csv">CSV Data Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Report Preview Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Contents</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Executive Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Emissions</span>
                    <span className="font-bold">{emissionTrend.current} kg CO2e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trend</span>
                    <div className="flex items-center gap-1">
                      {emissionTrend.change < 0 ? (
                        <>
                          <IconTrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-500">
                            {Math.abs(emissionTrend.change)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <IconTrendingUp className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-500">
                            {emissionTrend.change}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />
                </CardContent>
              </Card>

              {/* Sector Benchmarking */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Sector Benchmarking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Your Performance</span>
                    <Badge variant="default">Top 32%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">vs. {sectorComparison.sector}</span>
                    <span className="text-sm font-medium text-green-500">
                      -{((1 - sectorComparison.yourEmissions / sectorComparison.sectorAverage) * 100).toFixed(0)}% below avg
                    </span>
                  </div>
                  <Progress value={sectorComparison.percentile} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* SDG Alignment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">UN SDG Alignment</CardTitle>
                <CardDescription className="text-xs">
                  Your contribution to Sustainable Development Goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sdgGoals.map((goal) => (
                  <div key={goal.number} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {goal.number}
                        </div>
                        <span className="text-sm font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm font-bold">{goal.alignment}%</span>
                    </div>
                    <Progress value={goal.alignment} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Sections Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Included Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Emission Breakdown (Scope 1 & 2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Monthly Trend Charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Sector Comparison Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Bill Evidence Appendix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Compliance Statement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center">
                      <IconLeaf className="w-3 h-3 text-white" />
                    </div>
                    <span>Recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quota Warning Alert */}
          {!quotaLoading && quotaData && !quotaData.reportGeneration.unlimited && quotaData.reportGeneration.remaining <= 3 && (
            <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20">
              <div className="flex items-start gap-3">
                <IconLeaf className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                    {reportQuotaExceeded ? 'Monthly Report Quota Exceeded' : 'Low Report Quota'}
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                    {reportQuotaExceeded 
                      ? `You have used all ${quotaData.reportGeneration.limit} report generations. Quota resets on ${new Date(quotaData.reportGeneration.resetTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`
                      : `Only ${quotaData.reportGeneration.remaining} report generation${quotaData.reportGeneration.remaining === 1 ? '' : 's'} remaining this month.`
                    }
                  </p>
                </div>
                <Badge variant={reportQuotaExceeded ? "destructive" : "default"}>
                  {quotaData.reportGeneration.current} / {quotaData.reportGeneration.limit}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1" 
              size="lg"
              disabled={reportQuotaExceeded || quotaLoading}
              onClick={() => {
                if (reportQuotaExceeded) {
                  toast.error("Cannot Generate Report", {
                    description: "You have exceeded your monthly report generation quota.",
                  });
                }
              }}
            >
              <IconDownload className="w-4 h-4 mr-2" />
              {reportQuotaExceeded ? 'Quota Exceeded' : 'Generate & Download Report'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              disabled={reportQuotaExceeded || quotaLoading}
            >
              <IconEye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Previous Reports</CardTitle>
              <CardDescription>Access previously generated ESG reports</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetchReports()}
              disabled={reportsLoading}
            >
              <IconRefresh className={`w-4 h-4 mr-2 ${reportsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <IconRefresh className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading reports...</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
              <IconFileTypePdf className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-lg mb-1">No Reports Yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Generate your first ESG report to see it here. Reports help you track your emissions progress over time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <IconFileTypePdf className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{report.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconCalendar className="w-3 h-3" />
                          {formatDate(report.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <IconBuildingFactory className="w-3 h-3" />
                          {report.totalCo2e?.toFixed(2) || 0} kg CO2e
                        </span>
                        <span>{report.downloadCount || 0} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="default" className="bg-green-500">
                      {report.status === 'completed' ? 'Ready' : report.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <IconEye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" disabled={!report.pdfUrl}>
                      <IconDownload className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconShare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;