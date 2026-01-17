import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { 
  IconTrendingDown,
  IconChartBar,
  IconLeaf,
  IconTarget,
  IconAward,
  IconDownload,
  IconRefresh,
  IconArrowDown
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsPage = () => {
  // Mock data - will be replaced with BigQuery data
  const yourPerformance = {
    currentEmissions: 1247.5,
    previousEmissions: 1348.2,
    sectorAverage: 1556.3,
    percentile: 68, // Top 32%
    rank: 32,
    totalCompanies: 100,
    sector: "Manufacturing"
  };

  const sectorComparison = [
    { sector: "Your Company", emissions: 1247.5, isYou: true, rank: 1 },
    { sector: "Top Performer", emissions: 980.2, isYou: false, rank: 1 },
    { sector: "25th Percentile", emissions: 1120.5, isYou: false, rank: 25 },
    { sector: "Median (50th)", emissions: 1345.8, isYou: false, rank: 50 },
    { sector: "Sector Average", emissions: 1556.3, isYou: false, rank: 0 },
    { sector: "75th Percentile", emissions: 1820.4, isYou: false, rank: 75 },
    { sector: "Bottom Performer", emissions: 2340.1, isYou: false, rank: 100 },
  ];

  const regionalComparison = [
    { region: "Johor", avgEmissions: 1420.5, companies: 45 },
    { region: "Selangor", avgEmissions: 1380.2, companies: 78 },
    { region: "Penang", avgEmissions: 1245.8, companies: 34 },
    { region: "Kuala Lumpur", avgEmissions: 1156.3, companies: 52 },
  ];

  const topPerformers = [
    { name: "Green Tech Solutions", sector: "Technology", emissions: 892.3, improvement: -15.2 },
    { name: "Eco Manufacturing Sdn Bhd", sector: "Manufacturing", emissions: 980.2, improvement: -12.8 },
    { name: "Your Company (Muar Furniture)", sector: "Manufacturing", emissions: 1247.5, improvement: -7.5, isYou: true },
    { name: "Sustainable Foods Ltd", sector: "F&B", emissions: 1289.4, improvement: -6.3 },
    { name: "Clean Logistics Pro", sector: "Logistics", emissions: 1345.7, improvement: -5.1 },
  ];

  const emissionTrends = [
    { month: "Jul 25", yours: 1456, sectorAvg: 1620 },
    { month: "Aug 25", yours: 1420, sectorAvg: 1598 },
    { month: "Sep 25", yours: 1389, sectorAvg: 1580 },
    { month: "Oct 25", yours: 1402, sectorAvg: 1572 },
    { month: "Nov 25", yours: 1380, sectorAvg: 1565 },
    { month: "Dec 25", yours: 1348, sectorAvg: 1560 },
    { month: "Jan 26", yours: 1247, sectorAvg: 1556 },
  ];

  const improvementRate = ((yourPerformance.previousEmissions - yourPerformance.currentEmissions) / yourPerformance.previousEmissions * 100).toFixed(1);
  const belowAverage = ((1 - yourPerformance.currentEmissions / yourPerformance.sectorAverage) * 100).toFixed(0);

  const maxEmissions = Math.max(...sectorComparison.map(s => s.emissions));

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
          <Button variant="outline" size="sm">
            <IconRefresh className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <IconDownload className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Select defaultValue="manufacturing">
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="fnb">Food & Beverage</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="all">All Sectors</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="monthly">
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-regions">
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-regions">All Malaysia</SelectItem>
                <SelectItem value="johor">Johor</SelectItem>
                <SelectItem value="selangor">Selangor</SelectItem>
                <SelectItem value="penang">Penang</SelectItem>
                <SelectItem value="kl">Kuala Lumpur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top {100 - yourPerformance.percentile}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rank #{yourPerformance.rank} of {yourPerformance.totalCompanies} companies
            </p>
            <Progress value={yourPerformance.percentile} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">vs Sector Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">-{belowAverage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {belowAverage}% below sector average
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
              <IconTrendingDown className="w-4 h-4" />
              <span>Better than average</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">-{improvementRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {yourPerformance.previousEmissions} to {yourPerformance.currentEmissions} kg
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
              <IconArrowDown className="w-4 h-4" />
              <span>On track to target</span>
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
            <Badge variant="outline" className="mt-2">Medium-sized SME</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Highlight */}
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
                You&apos;re emitting {belowAverage}% less than the {yourPerformance.sector} sector average. 
                Keep up the great work to maintain your competitive advantage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sector Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Benchmarking - {yourPerformance.sector}</CardTitle>
          <CardDescription>Your position relative to industry peers (kg CO2e/month)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectorComparison.map((item) => {
            const percentage = (item.emissions / maxEmissions) * 100;
            
            return (
              <div key={item.sector} className={`space-y-2 ${item.isYou ? 'p-3 bg-primary/10 rounded-lg border-2 border-primary' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.isYou && <IconTarget className="w-4 h-4 text-primary" />}
                    <span className={`text-sm font-medium ${item.isYou ? 'text-primary font-bold' : ''}`}>
                      {item.sector}
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

      {/* Trend Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emission Trends */}
        <Card>
          <CardHeader>
            <CardTitle>6-Month Emission Trends</CardTitle>
            <CardDescription>Your emissions vs sector average over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emissionTrends.map((data) => {
              const maxTrend = Math.max(data.yours, data.sectorAvg);
              const yourPercentage = (data.yours / maxTrend) * 100;
              const avgPercentage = (data.sectorAvg / maxTrend) * 100;
              
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>{data.month}</span>
                    <div className="flex gap-4">
                      <span className="text-primary">You: {data.yours} kg</span>
                      <span className="text-muted-foreground">Avg: {data.sectorAvg} kg</span>
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

        {/* Regional Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Comparison</CardTitle>
            <CardDescription>Average emissions by state/region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionalComparison.map((region) => {
              const isYourRegion = region.region === "Johor";
              const maxRegional = Math.max(...regionalComparison.map(r => r.avgEmissions));
              const percentage = (region.avgEmissions / maxRegional) * 100;
              
              return (
                <div key={region.region} className={`space-y-2 ${isYourRegion ? 'p-2 bg-primary/10 rounded-lg' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isYourRegion ? 'text-primary font-bold' : ''}`}>
                        {region.region}
                      </span>
                      {isYourRegion && <Badge variant="outline" className="text-xs">Your Region</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{region.avgEmissions.toFixed(1)} kg</p>
                      <p className="text-xs text-muted-foreground">{region.companies} companies</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Leaderboard */}
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
                key={company.name}
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
                        {company.name}
                      </p>
                      {company.isYou && <Badge variant="default">You</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{company.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{company.emissions.toFixed(1)} kg CO2e</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <IconTrendingDown className="w-3 h-3" />
                    <span>{Math.abs(company.improvement)}% reduction</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>Personalized recommendations based on benchmarking data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
            <IconLeaf className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Competitive Advantage</h4>
              <p className="text-sm text-muted-foreground">
                Your low carbon footprint is a strong selling point for ESG-conscious buyers. 
                Highlight your top 32% ranking in proposals to IKEA and other MNCs.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 border rounded-lg">
            <IconTarget className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Target for Top 25%</h4>
              <p className="text-sm text-muted-foreground">
                You&apos;re only 127 kg CO2e away from breaking into the top 25% of manufacturers. 
                Focus on optimizing electricity usage during peak hours to reach this milestone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 border rounded-lg">
            <IconChartBar className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Consistent Improvement</h4>
              <p className="text-sm text-muted-foreground">
                You&apos;ve reduced emissions for 3 consecutive months (-7.5% average). 
                This trend puts you on track to achieve SDG Goal 12 targets by Q3 2026.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
