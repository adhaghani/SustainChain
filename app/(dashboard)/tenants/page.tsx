import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconPlus, 
  IconSearch, 
  IconBuildingFactory,
  IconUsers,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconEye,
  IconSettings,
  IconChartBar,
  IconShield,
  IconCheck,
  IconClock
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const TenantsPage = () => {
  // Mock data - will be replaced with Firebase data
  const tenants = [
    {
      id: "1",
      name: "Muar Furniture Industries Sdn Bhd",
      uen: "202001012345",
      sector: "Manufacturing",
      address: "Lot 123, Jalan Industri, 84000 Muar, Johor",
      adminName: "Ahmad bin Ibrahim",
      adminEmail: "ahmad@muarfurniture.com",
      userCount: 8,
      emissionEntries: 45,
      totalEmissions: 15420.5,
      status: "active",
      subscriptionTier: "premium",
      joinedDate: "2025-06-15",
      lastActivity: "2026-01-17",
      logo: null
    },
    {
      id: "2",
      name: "Green Tech Solutions Sdn Bhd",
      uen: "202002023456",
      sector: "Technology",
      address: "Unit 5-2, Menara TM, 50450 Kuala Lumpur",
      adminName: "Sarah Lee",
      adminEmail: "sarah.lee@greentech.my",
      userCount: 15,
      emissionEntries: 89,
      totalEmissions: 8920.2,
      status: "active",
      subscriptionTier: "enterprise",
      joinedDate: "2025-03-20",
      lastActivity: "2026-01-17",
      logo: null
    },
    {
      id: "3",
      name: "Johor Fresh Foods Sdn Bhd",
      uen: "202003034567",
      sector: "Food & Beverage",
      address: "No 88, Jalan Perniagaan, 81200 Johor Bahru",
      adminName: "Lim Chong Wei",
      adminEmail: "lim@jffoods.com",
      userCount: 5,
      emissionEntries: 23,
      totalEmissions: 4230.8,
      status: "active",
      subscriptionTier: "standard",
      joinedDate: "2025-09-10",
      lastActivity: "2026-01-16",
      logo: null
    },
    {
      id: "4",
      name: "Logistics Pro Malaysia",
      uen: "202004045678",
      sector: "Logistics",
      address: "Warehouse 12, KLIA Logistics Park, 43900 Sepang",
      adminName: "Kumar Raj",
      adminEmail: "kumar@logisticspro.my",
      userCount: 12,
      emissionEntries: 67,
      totalEmissions: 28450.3,
      status: "trial",
      subscriptionTier: "trial",
      joinedDate: "2026-01-05",
      lastActivity: "2026-01-17",
      logo: null
    },
    {
      id: "5",
      name: "Penang Electronics Assembly",
      uen: "202005056789",
      sector: "Manufacturing",
      address: "Plot 45, Bayan Lepas Industrial Park, 11900 Penang",
      adminName: "Wong Li Ting",
      adminEmail: "wong@pea-electronics.com",
      userCount: 3,
      emissionEntries: 12,
      totalEmissions: 2340.1,
      status: "inactive",
      subscriptionTier: "standard",
      joinedDate: "2025-08-22",
      lastActivity: "2025-12-20",
      logo: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Active</Badge>;
      case "trial":
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Trial</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return <Badge variant="default" className="bg-purple-500">Enterprise</Badge>;
      case "premium":
        return <Badge variant="default" className="bg-blue-500">Premium</Badge>;
      case "standard":
        return <Badge variant="secondary">Standard</Badge>;
      case "trial":
        return <Badge variant="outline">Trial</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const activeTenantsCount = tenants.filter(t => t.status === "active").length;
  const totalUsers = tenants.reduce((sum, t) => sum + t.userCount, 0);
  const totalEmissions = tenants.reduce((sum, t) => sum + t.totalEmissions, 0);
  const trialTenantsCount = tenants.filter(t => t.status === "trial").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage registered companies and their subscriptions
          </p>
        </div>
        <Button>
          <IconPlus className="w-4 h-4 mr-2" />
          Add New Tenant
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTenantsCount} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalEmissions / 1000).toFixed(1)}t</div>
            <p className="text-xs text-muted-foreground mt-1">
              CO2e tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trial Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialTenantsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tenants</CardTitle>
              <CardDescription>Manage registered companies and their access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by company name, UEN, or admin..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <IconSettings className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Tenant Cards */}
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left Section */}
                    <div className="flex gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={tenant.logo || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {getInitials(tenant.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        {/* Company Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{tenant.name}</h3>
                            {getStatusBadge(tenant.status)}
                            {getTierBadge(tenant.subscriptionTier)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IconBuildingFactory className="w-4 h-4" />
                              {tenant.sector}
                            </span>
                            <span>UEN: {tenant.uen}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{tenant.address}</p>
                        </div>

                        <Separator />

                        {/* Metrics */}
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Admin</p>
                            <p className="text-sm font-medium">{tenant.adminName}</p>
                            <p className="text-xs text-muted-foreground">{tenant.adminEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Users</p>
                            <div className="flex items-center gap-1">
                              <IconUsers className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-bold">{tenant.userCount}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Entries</p>
                            <div className="flex items-center gap-1">
                              <IconChartBar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-bold">{tenant.emissionEntries}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total CO2e</p>
                            <span className="text-sm font-bold">{(tenant.totalEmissions / 1000).toFixed(2)}t</span>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <IconCalendar className="w-3 h-3" />
                            Joined {formatDate(tenant.joinedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconClock className="w-3 h-3" />
                            Last active {formatDate(tenant.lastActivity)}
                          </span>
                        </div>

                        {/* Trial Progress (if applicable) */}
                        {tenant.subscriptionTier === "trial" && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Trial Progress</span>
                              <span className="font-medium">12 days remaining</span>
                            </div>
                            <Progress value={60} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <IconSettings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconEye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconEdit className="w-4 h-4 mr-2" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconChartBar className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Subscription</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconShield className="w-4 h-4 mr-2" />
                          Manage Plan
                        </DropdownMenuItem>
                        {tenant.status === "trial" && (
                          <DropdownMenuItem>
                            <IconCheck className="w-4 h-4 mr-2" />
                            Convert to Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <IconTrash className="w-4 h-4 mr-2" />
                          Deactivate Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {tenants.length} of {tenants.length} tenants
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats by Sector */}
      <Card>
        <CardHeader>
          <CardTitle>Tenants by Sector</CardTitle>
          <CardDescription>Distribution across industries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { sector: "Manufacturing", count: 2, percentage: 40 },
              { sector: "Technology", count: 1, percentage: 20 },
              { sector: "Food & Beverage", count: 1, percentage: 20 },
              { sector: "Logistics", count: 1, percentage: 20 },
            ].map((item) => (
              <div key={item.sector} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.sector}</span>
                  <span className="text-muted-foreground">{item.count} tenants ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantsPage;