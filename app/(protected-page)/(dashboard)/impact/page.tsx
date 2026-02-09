import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  IconLeaf,
  IconBuildingFactory2,
  IconChartBar,
  IconTrendingDown,
  IconTrendingUp,
  IconAward,
  IconHeartHandshake,
  IconWorld,
  IconBolt,
  IconDroplet,
  IconGasStation,
  IconRecycle,
  IconSun,
  IconTree,
  IconCertificate,
  IconTargetArrow,
  IconSparkles
} from "@tabler/icons-react";

const ImpactPage = () => {
  const platformMetrics = {
    totalCO2Saved: 1247.5,
    companiesHelped: 89,
    economicImpact: 12.4,
    contractsRetained: 43,
    growthRate: 34.5
  };

  const sdgImpact = [
    {
      number: 7,
      title: "Affordable and Clean Energy",
      description: "Promoting energy efficiency and renewable adoption",
      progress: 78,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
      icon: IconSun
    },
    {
      number: 9,
      title: "Industry, Innovation and Infrastructure",
      description: "Building resilient and sustainable infrastructure",
      progress: 85,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      icon: IconBuildingFactory2
    },
    {
      number: 11,
      title: "Sustainable Cities and Communities",
      description: "Making cities inclusive, safe, and sustainable",
      progress: 72,
      color: "text-amber-500",
      bgColor: "bg-amber-500",
      icon: IconWorld
    },
    {
      number: 12,
      title: "Responsible Consumption and Production",
      description: "Ensuring sustainable consumption and production patterns",
      progress: 81,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600",
      icon: IconRecycle
    },
    {
      number: 13,
      title: "Climate Action",
      description: "Taking urgent action to combat climate change",
      progress: 89,
      color: "text-green-600",
      bgColor: "bg-green-600",
      icon: IconLeaf
    },
    {
      number: 17,
      title: "Partnerships for the Goals",
      description: "Strengthening means of implementation",
      progress: 76,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      icon: IconHeartHandshake
    }
  ];

  const successStories = [
    {
      company: "Syarikat Pembinaan Rahman",
      sector: "Construction",
      reduction: 42.3,
      period: "6 months",
      story: "Reduced electricity costs by RM 8,500/month through AI-powered insights and sector benchmarking",
      logo: "🏗️"
    },
    {
      company: "Kedai Runcit Haji Ali",
      sector: "Retail",
      reduction: 28.7,
      period: "4 months",
      story: "Retained corporate contracts worth RM 1.2M by achieving ESG compliance ahead of competitors",
      logo: "🏪"
    },
    {
      company: "Kilang Tekstil Melaka",
      sector: "Manufacturing",
      reduction: 56.2,
      period: "8 months",
      story: "Qualified for green financing at 2% lower interest rate, saving RM 45,000 annually",
      logo: "🏭"
    }
  ];

  const emissionBreakdown = [
    {
      type: "Electricity",
      amount: 847.3,
      percentage: 68,
      icon: IconBolt,
      color: "text-yellow-500"
    },
    {
      type: "Water",
      amount: 234.8,
      percentage: 19,
      icon: IconDroplet,
      color: "text-blue-500"
    },
    {
      type: "Fuel",
      amount: 165.4,
      percentage: 13,
      icon: IconGasStation,
      color: "text-orange-500"
    }
  ];

  const milestones = [
    {
      date: "December 2024",
      title: "Platform Launch",
      description: "SustainChain goes live with 12 pilot companies",
      icon: IconSparkles,
      completed: true
    },
    {
      date: "January 2025",
      title: "50 Companies Milestone",
      description: "Reached 50 SMEs using the platform",
      icon: IconBuildingFactory2,
      completed: true
    },
    {
      date: "March 2025",
      title: "1,000 Tonnes CO2e Saved",
      description: "Collective emissions reduced by over 1,000 tonnes",
      icon: IconLeaf,
      completed: true
    },
    {
      date: "Q2 2025",
      title: "100 Companies Goal",
      description: "Target to onboard 100 Malaysian SMEs",
      icon: IconTargetArrow,
      completed: false
    },
    {
      date: "Q3 2025",
      title: "Government Partnership",
      description: "Partner with MITI for nationwide rollout",
      icon: IconAward,
      completed: false
    }
  ];

  const regionalImpact = [
    {
      region: "Peninsular Malaysia",
      companies: 58,
      co2Saved: 823.4,
      percentage: 66
    },
    {
      region: "Sabah & Sarawak",
      companies: 21,
      co2Saved: 298.1,
      percentage: 24
    },
    {
      region: "Other Regions",
      companies: 10,
      co2Saved: 126.0,
      percentage: 10
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <IconLeaf className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Platform Impact</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Measuring our collective contribution to Malaysia&apos;s ESG goals
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-green-200 dark:border-green-900">
          <CardContent >
            <div className="flex items-center justify-between mb-2">
              <IconLeaf className="w-8 h-8 text-green-500" />
              <Badge variant="secondary" className="text-green-600">
                <IconTrendingDown className="w-3 h-3 mr-1" />
                -34%
              </Badge>
            </div>
            <div className="text-3xl font-bold">{platformMetrics.totalCO2Saved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tonnes CO2e Reduced</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardContent >
            <div className="flex items-center justify-between mb-2">
              <IconBuildingFactory2 className="w-8 h-8 text-blue-500" />
              <Badge variant="secondary" className="text-blue-600">
                <IconTrendingUp className="w-3 h-3 mr-1" />
                +{platformMetrics.growthRate}%
              </Badge>
            </div>
            <div className="text-3xl font-bold">{platformMetrics.companiesHelped}</div>
            <p className="text-xs text-muted-foreground">Malaysian SMEs Helped</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900">
          <CardContent >
            <div className="flex items-center justify-between mb-2">
              <IconChartBar className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold">RM {platformMetrics.economicImpact}M</div>
            <p className="text-xs text-muted-foreground">Economic Impact</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardContent >
            <div className="flex items-center justify-between mb-2">
              <IconCertificate className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold">{platformMetrics.contractsRetained}</div>
            <p className="text-xs text-muted-foreground">Contracts Retained</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 dark:border-teal-900">
          <CardContent >
            <div className="flex items-center justify-between mb-2">
              <IconTree className="w-8 h-8 text-teal-500" />
            </div>
            <div className="text-3xl font-bold">27,843</div>
            <p className="text-xs text-muted-foreground">Trees Equivalent</p>
          </CardContent>
        </Card>
      </div>

      {/* SDG Alignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconWorld className="w-5 h-5" />
            UN Sustainable Development Goals Alignment
          </CardTitle>
          <CardDescription>
            How SustainChain contributes to the 2030 Agenda for Sustainable Development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {sdgImpact.map((sdg) => {
              const Icon = sdg.icon;
              return (
                <Card key={sdg.number}>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-lg ${sdg.bgColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">SDG {sdg.number}</Badge>
                          <span className="text-xs text-muted-foreground">{sdg.progress}% alignment</span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{sdg.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{sdg.description}</p>
                        <Progress value={sdg.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emission Breakdown & Regional Impact */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Emission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emission Reductions by Type</CardTitle>
            <CardDescription>Total: {platformMetrics.totalCO2Saved} tonnes CO2e</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emissionBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium text-sm">{item.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.amount} tonnes ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Regional Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Companies by region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionalImpact.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{region.region}</span>
                  <span className="text-sm text-muted-foreground">
                    {region.companies} companies
                  </span>
                </div>
                <Progress value={region.percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{region.co2Saved} tonnes CO2e saved</span>
                  <span>{region.percentage}% of total</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAward className="w-5 h-5" />
            Success Stories
          </CardTitle>
          <CardDescription>Real impact from Malaysian SMEs using SustainChain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {successStories.map((story, index) => (
              <Card key={index} className="border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4 text-center">{story.logo}</div>
                  <h4 className="font-semibold mb-1">{story.company}</h4>
                  <Badge variant="secondary" className="mb-3 text-xs">{story.sector}</Badge>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-green-600">-{story.reduction}%</div>
                      <p className="text-xs text-muted-foreground">Emissions Reduced</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold">{story.period}</div>
                      <p className="text-xs text-muted-foreground">Time Period</p>
                    </div>
                  </div>

                  <Separator className="mb-3" />

                  <p className="text-sm text-muted-foreground italic">
                    {story.story}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Milestones</CardTitle>
          <CardDescription>Our journey towards sustainable impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${
                    milestone.completed 
                      ? "bg-green-500" 
                      : "bg-muted"
                  } flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${
                      milestone.completed 
                        ? "text-white" 
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 pb-4 border-b last:border-b-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{milestone.date}</span>
                      {milestone.completed && (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          Completed
                        </Badge>
                      )}
                      {!milestone.completed && (
                        <Badge variant="outline" className="text-xs">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactPage;
