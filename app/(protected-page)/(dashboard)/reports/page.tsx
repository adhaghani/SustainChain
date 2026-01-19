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

const ReportsPage = () => {
  // Mock data - will be replaced with real data
  const reports = [
    {
      id: "1",
      title: "ESG Report - January 2026",
      period: "Jan 2026",
      generatedDate: "2026-01-17",
      totalEmissions: 1247.5,
      status: "ready",
      downloads: 3,
      format: "PDF"
    },
    {
      id: "2",
      title: "ESG Report - December 2025",
      period: "Dec 2025",
      generatedDate: "2025-12-31",
      totalEmissions: 1348.2,
      status: "ready",
      downloads: 5,
      format: "PDF"
    },
    {
      id: "3",
      title: "ESG Report - November 2025",
      period: "Nov 2025",
      generatedDate: "2025-11-30",
      totalEmissions: 1380.7,
      status: "ready",
      downloads: 2,
      format: "PDF"
    },
  ];

  const sectorComparison = {
    yourEmissions: 1247.5,
    sectorAverage: 1556.3,
    percentile: 68,
    sector: "Manufacturing"
  };

  const emissionTrend = {
    current: 1247.5,
    previous: 1348.2,
    change: -7.5
  };

  const sdgGoals = [
    { number: 8, title: "Decent Work and Economic Growth", alignment: 85 },
    { number: 9, title: "Industry, Innovation and Infrastructure", alignment: 78 },
    { number: 12, title: "Responsible Consumption and Production", alignment: 92 },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
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
        <Button>
          <IconDownload className="w-4 h-4 mr-2" />
          Generate New Report
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

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" size="lg">
              <IconDownload className="w-4 h-4 mr-2" />
              Generate & Download Report
            </Button>
            <Button variant="outline" size="lg">
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
            <Button variant="outline" size="sm">
              <IconRefresh className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                        {formatDate(report.generatedDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBuildingFactory className="w-3 h-3" />
                        {report.totalEmissions} kg CO2e
                      </span>
                      <span>{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.format}</Badge>
                  <Badge variant="default" className="bg-green-500">Ready</Badge>
                  <Button variant="outline" size="sm">
                    <IconEye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm">
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
        </CardContent>
      </Card>

      {/* Report Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Report Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <p>Reports are generated in real-time with the latest emissions data from your verified entries.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <p>PDF reports are compliant with Bursa Malaysia ESG reporting standards (2026).</p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <p>Bilingual reports include both English and Bahasa Malaysia sections for local stakeholders.</p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-primary">•</span>
            <p>Share reports directly with corporate buyers or regulatory bodies via secure links.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;