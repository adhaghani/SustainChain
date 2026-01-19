import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  IconSearch,
  IconHelp,
  IconBook,
  IconVideo,
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
  IconChevronRight,
  IconUpload,
  IconChartBar,
  IconFileText,
  IconSettings,
  IconUsers,
  IconShield,
  IconSparkles,
  IconExternalLink
} from "@tabler/icons-react";
import Image from "next/image";

const HelpPage = () => {
  const popularArticles = [
    {
      id: 1,
      category: "Getting Started",
      title: "How to upload your first utility bill",
      description: "Step-by-step guide to uploading and extracting bill data with AI",
      icon: IconUpload,
      views: 1234,
      helpful: 98
    },
    {
      id: 2,
      category: "AI Features",
      title: "Understanding AI extraction confidence scores",
      description: "Learn what confidence scores mean and when to manually verify data",
      icon: IconSparkles,
      views: 856,
      helpful: 95
    },
    {
      id: 3,
      category: "Reports",
      title: "Generating ESG-compliant PDF reports",
      description: "Create professional reports for stakeholders and corporate buyers",
      icon: IconFileText,
      views: 742,
      helpful: 97
    },
    {
      id: 4,
      category: "Analytics",
      title: "How sector benchmarking works",
      description: "Compare your emissions against industry peers and improve rankings",
      icon: IconChartBar,
      views: 623,
      helpful: 92
    },
    {
      id: 5,
      category: "User Management",
      title: "Adding team members and setting roles",
      description: "Invite users and assign Admin, Clerk, or Viewer permissions",
      icon: IconUsers,
      views: 512,
      helpful: 90
    },
    {
      id: 6,
      category: "Compliance",
      title: "PDPA compliance and data privacy",
      description: "How SustainChain protects your data under Malaysian law",
      icon: IconShield,
      views: 445,
      helpful: 94
    }
  ];

  const categories = [
    {
      name: "Getting Started",
      description: "New to SustainChain? Start here",
      icon: IconBook,
      articleCount: 8,
      color: "text-blue-500"
    },
    {
      name: "Bill Upload & AI",
      description: "Learn about AI-powered extraction",
      icon: IconUpload,
      articleCount: 12,
      color: "text-green-500"
    },
    {
      name: "Analytics & Benchmarking",
      description: "Understanding your carbon footprint data",
      icon: IconChartBar,
      articleCount: 15,
      color: "text-purple-500"
    },
    {
      name: "Reports & Compliance",
      description: "Generate ESG reports for stakeholders",
      icon: IconFileText,
      articleCount: 10,
      color: "text-orange-500"
    },
    {
      name: "Account & Settings",
      description: "Manage your account and preferences",
      icon: IconSettings,
      articleCount: 9,
      color: "text-cyan-500"
    },
    {
      name: "Security & Privacy",
      description: "Data protection and compliance",
      icon: IconShield,
      articleCount: 7,
      color: "text-red-500"
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "SustainChain Quick Start (3 min)",
      thumbnail: "https://via.placeholder.com/300x180?text=Quick+Start",
      duration: "3:24",
      views: 2450
    },
    {
      id: 2,
      title: "Uploading Bills with AI Extraction (5 min)",
      thumbnail: "https://via.placeholder.com/300x180?text=Bill+Upload",
      duration: "5:12",
      views: 1890
    },
    {
      id: 3,
      title: "Understanding Your Analytics Dashboard (7 min)",
      thumbnail: "https://via.placeholder.com/300x180?text=Analytics",
      duration: "7:45",
      views: 1234
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <IconHelp className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Search our knowledge base or browse categories below
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles, tutorials, or FAQs..." 
              className="pl-12 h-14 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Popular searches:</span>
            <Badge variant="secondary" className="cursor-pointer">Upload bill</Badge>
            <Badge variant="secondary" className="cursor-pointer">AI extraction</Badge>
            <Badge variant="secondary" className="cursor-pointer">Generate report</Badge>
            <Badge variant="secondary" className="cursor-pointer">Benchmarking</Badge>
            <Badge variant="secondary" className="cursor-pointer">Add users</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Help */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <IconBrandWhatsapp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">WhatsApp Support</h3>
                <p className="text-sm text-muted-foreground mt-1">Get instant help</p>
              </div>
              <Button variant="outline" size="sm">
                Chat Now
                <IconChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <IconMail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground mt-1">support@sustainchain.app</p>
              </div>
              <Button variant="outline" size="sm">
                Send Email
                <IconChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                <IconPhone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 9AM-6PM</p>
              </div>
              <Button variant="outline" size="sm">
                +60 3-1234 5678
                <IconChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Articles</CardTitle>
          <CardDescription>Most viewed help articles this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularArticles.map((article) => {
              const Icon = article.icon;
              return (
                <div
                  key={article.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
                    <p className="text-xs text-muted-foreground">{article.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{article.views} views</span>
                      <span>•</span>
                      <span>{article.helpful}% found helpful</span>
                    </div>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Browse by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
          <CardDescription>Explore help articles organized by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{category.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {category.articleCount} articles
                        </Badge>
                      </div>
                      <IconChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconVideo className="w-5 h-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>Watch step-by-step guides</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
              <IconExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative">
                  <Image 
                  width={100}
                  height={100}
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <IconVideo className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-1">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.views} views</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">What file formats are supported for bill uploads?</h4>
              <p className="text-sm text-muted-foreground">
                SustainChain supports JPG, PNG, and PDF files up to 10MB. We recommend clear, well-lit photos for best AI extraction results.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">How accurate is the AI bill extraction?</h4>
              <p className="text-sm text-muted-foreground">
                Our Gemini 1.5 Flash AI achieves over 90% accuracy on Malaysian utility bills (TNB, SAJ, IWK). 
                You can always review and edit extracted data before saving.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">How is sector benchmarking calculated?</h4>
              <p className="text-sm text-muted-foreground">
                We analyze emission data from companies in your sector using BigQuery. Your ranking is updated monthly 
                based on average CO2e per employee or per revenue (depending on your industry).
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Is my data secure and PDPA compliant?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! All data is encrypted, backed up daily, and retained for 5 years as required by Malaysia&apos;s PDPA. 
                We never share your data with third parties without consent.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Can I export my data?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely. You can export emission entries as CSV, generate PDF reports, and download all your data 
                in JSON format from Settings → Data & Privacy.
              </p>
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <Button variant="outline">
              View All FAQs
              <IconChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Still Need Help */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Still need help?</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to assist you. We typically respond within 2 hours during business hours (Mon-Fri, 9AM-6PM MYT).
            </p>
            <div className="flex gap-2 justify-center">
              <Button>
                <IconMail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <IconBrandWhatsapp className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
