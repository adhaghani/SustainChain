import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  IconSparkles,
  IconBug,
  IconTool,
  IconRocket,
  IconShieldCheck,
  IconChartBar,
  IconUpload,
  IconFileText,
  IconUsers,
  IconSettings,
  IconBell,
  IconDatabase,
  IconLanguage,
  IconDeviceMobile
} from "@tabler/icons-react";

const ChangelogPage = () => {
  const releases = [
    {
      version: "1.3.0",
      date: "March 15, 2025",
      status: "Latest",
      changes: [
        {
          type: "feature",
          title: "Multi-language Support",
          description: "Added Bahasa Malaysia and Simplified Chinese language options for reports and UI",
          icon: IconLanguage
        },
        {
          type: "feature",
          title: "Mobile App (Beta)",
          description: "Launch of iOS and Android apps for on-the-go bill scanning",
          icon: IconDeviceMobile
        },
        {
          type: "improvement",
          title: "Enhanced AI Extraction",
          description: "Upgraded to Gemini 1.5 Pro for 95% accuracy on water and fuel bills",
          icon: IconSparkles
        },
        {
          type: "improvement",
          title: "Faster Report Generation",
          description: "PDF reports now generate 60% faster with improved formatting",
          icon: IconFileText
        },
        {
          type: "fix",
          title: "Fixed Benchmarking Edge Cases",
          description: "Resolved issue where companies with <5 employees showed incorrect rankings",
          icon: IconBug
        }
      ]
    },
    {
      version: "1.2.5",
      date: "February 28, 2025",
      changes: [
        {
          type: "feature",
          title: "Real-time Notifications",
          description: "Get instant alerts when reports are ready or bills need review",
          icon: IconBell
        },
        {
          type: "feature",
          title: "Advanced Filters",
          description: "Filter entries by utility provider, date range, confidence score, and more",
          icon: IconSettings
        },
        {
          type: "improvement",
          title: "BigQuery Performance",
          description: "Optimized sector benchmarking queries for 3x faster load times",
          icon: IconDatabase
        },
        {
          type: "security",
          title: "Enhanced Data Encryption",
          description: "Implemented AES-256 encryption for all stored bill images",
          icon: IconShieldCheck
        }
      ]
    },
    {
      version: "1.2.0",
      date: "February 10, 2025",
      changes: [
        {
          type: "feature",
          title: "Sector Benchmarking",
          description: "Compare your emissions against industry peers and see your percentile ranking",
          icon: IconChartBar
        },
        {
          type: "feature",
          title: "Team Collaboration",
          description: "Invite team members with role-based access (Admin, Clerk, Viewer)",
          icon: IconUsers
        },
        {
          type: "feature",
          title: "Audit Trail",
          description: "PDPA-compliant activity logging for all user actions",
          icon: IconShieldCheck
        },
        {
          type: "improvement",
          title: "Drag & Drop Upload",
          description: "Revamped upload interface with support for batch uploads (up to 10 files)",
          icon: IconUpload
        }
      ]
    },
    {
      version: "1.1.0",
      date: "January 20, 2025",
      changes: [
        {
          type: "feature",
          title: "ESG Report Templates",
          description: "Pre-built templates for GRI, TCFD, and Bursa Malaysia ESG disclosures",
          icon: IconFileText
        },
        {
          type: "feature",
          title: "Custom Emission Factors",
          description: "Set company-specific emission factors for more accurate calculations",
          icon: IconTool
        },
        {
          type: "improvement",
          title: "Dashboard Redesign",
          description: "New analytics cards with 6-month trend charts and AI insights",
          icon: IconSparkles
        },
        {
          type: "fix",
          title: "TNB Bill Format Support",
          description: "Fixed extraction issues with new TNB bill layouts from January 2025",
          icon: IconBug
        }
      ]
    },
    {
      version: "1.0.0",
      date: "December 1, 2024",
      status: "Launch",
      changes: [
        {
          type: "feature",
          title: "AI-Powered Bill Extraction",
          description: "Automatic extraction of consumption, charges, and dates from utility bills",
          icon: IconSparkles
        },
        {
          type: "feature",
          title: "Carbon Footprint Dashboard",
          description: "Visual dashboard showing total emissions, breakdowns, and trends",
          icon: IconChartBar
        },
        {
          type: "feature",
          title: "PDF Report Generation",
          description: "Generate professional ESG reports with charts and SDG alignment",
          icon: IconFileText
        },
        {
          type: "feature",
          title: "Multi-Tenant Architecture",
          description: "Support for multiple companies under one platform instance",
          icon: IconUsers
        }
      ]
    }
  ];

  const upcomingFeatures = [
    {
      title: "API Integration",
      description: "REST API for third-party integrations with accounting software",
      quarter: "Q2 2025",
      icon: IconRocket
    },
    {
      title: "Automated Data Collection",
      description: "Direct integration with TNB, SAJ, and IWK for automatic bill import",
      quarter: "Q3 2025",
      icon: IconDatabase
    },
    {
      title: "Sustainability Recommendations",
      description: "AI-powered suggestions to reduce emissions based on your usage patterns",
      quarter: "Q3 2025",
      icon: IconSparkles
    },
    {
      title: "Supply Chain Emissions",
      description: "Track Scope 3 emissions from vendors and logistics",
      quarter: "Q4 2025",
      icon: IconChartBar
    }
  ];

  const getChangeTypeConfig = (type: string) => {
    switch (type) {
      case "feature":
        return {
          badge: "New Feature",
          color: "bg-green-500",
          borderColor: "border-green-200 dark:border-green-900"
        };
      case "improvement":
        return {
          badge: "Improvement",
          color: "bg-blue-500",
          borderColor: "border-blue-200 dark:border-blue-900"
        };
      case "fix":
        return {
          badge: "Bug Fix",
          color: "bg-orange-500",
          borderColor: "border-orange-200 dark:border-orange-900"
        };
      case "security":
        return {
          badge: "Security",
          color: "bg-red-500",
          borderColor: "border-red-200 dark:border-red-900"
        };
      default:
        return {
          badge: "Update",
          color: "bg-gray-500",
          borderColor: "border-gray-200 dark:border-gray-900"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground mt-2">
          Track new features, improvements, and bug fixes as we build the future of ESG reporting
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Major Releases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">New Features</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Improvements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Bug Fixes</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Features */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconRocket className="w-5 h-5" />
            Upcoming Features
          </CardTitle>
          <CardDescription>What we&apos;re working on next</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{feature.title}</h4>
                          <Badge variant="outline" className="text-xs">{feature.quarter}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Release History */}
      <Card>
        <CardHeader>
          <CardTitle>Release History</CardTitle>
          <CardDescription>Detailed changelog for all versions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {releases.map((release, releaseIndex) => (
              <div key={release.version}>
                {/* Version Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">v{release.version}</h3>
                      {release.status && (
                        <Badge variant={release.status === "Latest" ? "default" : "secondary"}>
                          {release.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{release.date}</p>
                  </div>
                </div>

                {/* Changes */}
                <div className="space-y-3 ml-4 border-l-2 border-muted pl-6">
                  {release.changes.map((change, changeIndex) => {
                    const Icon = change.icon;
                    const typeConfig = getChangeTypeConfig(change.type);
                    return (
                      <Card key={changeIndex} className={typeConfig.borderColor}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full ${typeConfig.color} mt-2 shrink-0`} />
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{change.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {typeConfig.badge}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{change.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {releaseIndex < releases.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscribe to Updates */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter to get notified about new features and improvements
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                <IconBell className="w-3 h-3 mr-1" />
                Email Updates
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                <IconRocket className="w-3 h-3 mr-1" />
                RSS Feed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangelogPage;
